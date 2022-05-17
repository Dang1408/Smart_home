package client

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"sync"
	"time"

	"github.com/Dang1408/Smart_home/connect/topics"
	mqtt "github.com/eclipse/paho.mqtt.golang"
	log "github.com/sirupsen/logrus"

	"github.com/gorilla/websocket"
)

const (
	INIT  = "init"
	PUB   = "pub"
	SUB   = "sub"
	UNSUB = "unsub"
)

const (
	WaitInterval = 60 * time.Second
	PingInterval = WaitInterval * 9 / 10
)

type Client struct {
	broker     string
	closeChan  chan struct{}
	mqttClient mqtt.Client
	msgChan    chan []byte
	mu         sync.Mutex
	password   string
	username   string
	wsConn     *websocket.Conn
}

func New_client(conn *websocket.Conn, broker, username, password string) *Client {
	return &Client{
		broker:    broker,
		closeChan: make(chan struct{}),
		msgChan:   make(chan []byte),
		password:  password,
		username:  username,
		wsConn:    conn,
	}
}

func Serve(write http.ResponseWriter, request *http.Request, broker, username, password string) {
	upgrade := websocket.Upgrader{
		ReadBufferSize:  4096,
		WriteBufferSize: 4096,
	}

	upgrade.CheckOrigin = func(request *http.Request) bool {
		return true
	}

	conn, err := upgrade.Upgrade(write, request, nil)

	if err != nil {
		log.WithFields(log.Fields{"error": err}).
			Error("Cannot upgrade http connection")
		return
	}

	connect := New_client(conn, broker, username, password)

	go connect.waitToReceive()
	go connect.listenToMsgChan()
}

//// Websocket

func (c *Client) waitToReceive() {
	c.wsConn.SetReadDeadline(time.Now().Add(WaitInterval))
	c.wsConn.SetPongHandler(func(string) error {
		c.wsConn.SetReadDeadline(time.Now().Add(WaitInterval))
		return nil
	})
	for {
		_, msg, err := c.wsConn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseNormalClosure, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.WithFields(log.Fields{"error": err}).Error("Unexpected close error")
			}
			c.handleDisconnect()
			c.wsConn.Close()
			break
		}
		c.request(msg)
	}
}

func (c *Client) listenToMsgChan() {
	ticker := time.NewTicker(PingInterval)
	defer func() {
		ticker.Stop()
	}()

loop:
	for {
		select {
		case msg, success := <-c.msgChan:
			if !success {
				return
			}
			c.respond(msg)
		case <-ticker.C:
			c.ping()
		case <-c.closeChan:
			break loop
		}
	}

}

func (c *Client) validMessage(pack map[string]interface{}) (string, string, string, error) {
	var action string
	var topic string
	var payload string

	if ac, success := pack["action"]; !success {
		return "", "", "", errors.New("missing action")
	} else {
		action = ac.(string)
	}

	if to, success := pack["topic"]; !success {
		return "", "", "", errors.New("missing topic")
	} else {
		topic = to.(string)
	}

	if pay, success := pack["payload"]; !success {
		return "", "", "", errors.New("missing payload")
	} else {
		payload = pay.(string)
	}

	return action, topic, payload, nil
}

func (c *Client) request(msg []byte) {
	var pack map[string]interface{}

	if err := json.Unmarshal(msg, &pack); err != nil {
		log.WithFields(log.Fields{"error": err}).
			Error("Invalid request payload")
	}

	action, topic, payload, err := c.validMessage(pack)

	if err != nil {
		log.WithFields(log.Fields{
			"packet": pack,
			"error":  err,
		}).Error("Invalid message Format")
	}
	///check action

	switch action {
	case INIT:
		clientId := payload
		if err := c.initMqtt(clientId); err != nil {
			log.WithFields(log.Fields{"error": err}).Error("MQTT server connection failed")
		}
	case PUB:
		if err := c.publishMqttTopic(topic, payload); err != nil {
			log.WithFields(log.Fields{"topic": topic, "error": err}).Error("Error publishing topic")
			response := fmt.Sprintf("Publishing %s failed", topic)
			c.respond([]byte(response))
		} else {
			response := fmt.Sprintf("Successfully published %s", topic)
			c.respond([]byte(response))
		}
	case SUB:
		if err := c.subscribeMqttTopic(topic); err != nil {
			log.WithFields(log.Fields{"topic": topic, "error": err}).Error("Error subscribing topic")
			response := fmt.Sprintf("Subscribing %s failed", topic)
			c.respond([]byte(response))
		} else {
			response := fmt.Sprintf("Successfully subscribed %s", topic)
			c.respond([]byte(response))
		}
	case UNSUB:
		if err := c.unsubscribeMqttTopic(topic); err != nil {
			log.WithFields(log.Fields{"topic": topic, "error": err}).Error("Error unsubscribing topic")
			response := fmt.Sprintf("Unsubscribing %s failed", topic)
			c.respond([]byte(response))
		} else {
			response := fmt.Sprintf("Successfully unsubscribed %s", topic)
			c.respond([]byte(response))
		}
	default:
		log.WithFields(log.Fields{"action": action}).Warn("Unknown action")
	}
}

func (c *Client) respond(msg []byte) {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.wsConn.WriteMessage(websocket.TextMessage, msg)
}

func (c *Client) ping() {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.wsConn.WriteMessage(websocket.PingMessage, []byte{})
}

func (c *Client) handleDisconnect() {
	if c.mqttClient != nil {
		c.mqttClient.Disconnect(250)
	}
	c.closeChan <- struct{}{}

	close(c.closeChan)
	close(c.msgChan)
}

///end\

func (c *Client) initMqtt(Client_ID string) error {
	c.mqttClient = c.initMqttClient(c.broker, Client_ID, c.username, c.password)
	if token := c.mqttClient.Connect(); token.Wait() && token.Error() != nil {
		return token.Error()
	}

	return nil
}

func (c *Client) initMqttClient(broker, clientId, username, password string) mqtt.Client {
	opts := mqtt.NewClientOptions()
	opts.AddBroker(fmt.Sprintf("tcp://%s", broker))
	opts.SetClientID(clientId)
	opts.SetUsername(username)
	opts.SetPassword(password)
	opts.SetAutoReconnect(false)
	opts.SetCleanSession(false)
	opts.SetDefaultPublishHandler(c.mqttMessageHandler)
	opts.SetOnConnectHandler(c.mqttConnectHandler)
	opts.SetConnectionLostHandler(c.mqttConnectLostHandler)
	opts.SetReconnectingHandler(c.mqttReconnectingHandler)

	return mqtt.NewClient(opts)
}

func (c *Client) mqttConnectHandler(client mqtt.Client) {
	log.Info("MQTT broker connected")
	c.respond([]byte("MQTT server connected"))
}

func (c *Client) mqttConnectLostHandler(client mqtt.Client, err error) {
	log.WithFields(log.Fields{"error": err}).Error("MQTT broker disconnected")
	c.respond([]byte("MQTT server disconnected"))
	c.wsConn.Close()
}

func (c *Client) mqttReconnectingHandler(client mqtt.Client, opts *mqtt.ClientOptions) {
	log.Info("MQTT broker reconnecting")
	c.respond([]byte("Reconnecting to MQTT server"))
}

func (c *Client) mqttMessageHandler(client mqtt.Client, msg mqtt.Message) {
	log.WithFields(log.Fields{"topic": msg.Topic()}).Info("Message received")
	c.msgChan <- msg.Payload()
}

func (c *Client) subscribeMqttTopic(topic string) error {
	if topics.FindTopic(topic, topics.Topics) {
		if err := c.subscribe(c.mqttClient, c.username, topic); err != nil {
			return err
		}
	} else if topics.FindTopic(topic, topics.Topics1) {
		if err := c.subscribe(c.mqttClient, c.username, topic); err != nil {
			return err
		}
	}
	return nil
}

func (c *Client) subscribe(client mqtt.Client, username, topic string) error {
	if client == nil {
		return errors.New("MQTT client not established yet")
	}
	if token := client.Subscribe(fmt.Sprintf("%s/feeds/%s", username, topic), 1, nil); token.Wait() && token.Error() != nil {
		return token.Error()
	}
	log.WithFields(log.Fields{"topic": topic}).Info("Subscribed")
	return nil
}

func (c *Client) unsubscribeMqttTopic(topic string) error {
	if topics.FindTopic(topic, topics.Topics) {
		if err := c.unsubscribe(c.mqttClient, c.username, topic); err != nil {
			return err
		}
	} else if topics.FindTopic(topic, topics.Topics1) {
		if err := c.unsubscribe(c.mqttClient, c.username, topic); err != nil {
			return err
		}
	}
	return nil
}

func (c *Client) unsubscribe(client mqtt.Client, username, topic string) error {
	if client == nil {
		return errors.New("MQTT client not established yet")
	}
	if token := client.Unsubscribe(fmt.Sprintf("%s/feeds/%s", username, topic)); token.Wait() && token.Error() != nil {
		return token.Error()
	}
	log.WithFields(log.Fields{"topic": topic}).Info("Unsubscribed")
	return nil
}

func (c *Client) publishMqttTopic(topic string, msg string) error {
	if topics.FindTopic(topic, topics.Topics) {
		if err := c.publish(c.mqttClient, c.username, topic, msg); err != nil {
			return err
		}
	} else if topics.FindTopic(topic, topics.Topics1) {
		if err := c.publish(c.mqttClient, c.username, topic, msg); err != nil {
			return err
		}
	}
	return nil
}

func (c *Client) publish(client mqtt.Client, username, topic string, msg string) error {
	if client == nil {
		return errors.New("MQTT client not established yet")
	}
	if token := client.Publish(fmt.Sprintf("%s/feeds/%s", username, topic), 0, false, msg); token.Wait() && token.Error() != nil {
		return token.Error()
	}
	log.WithFields(log.Fields{"topic": topic}).Info("Published")
	return nil
}
