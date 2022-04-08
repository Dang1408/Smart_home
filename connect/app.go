package main

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/Dang1408/Smart_home/connect/api"
	"github.com/Dang1408/Smart_home/connect/client"
	"github.com/Dang1408/Smart_home/connect/topics"
	mqtt "github.com/eclipse/paho.mqtt.golang"
	"github.com/google/uuid"
	"github.com/gorilla/mux"
	log "github.com/sirupsen/logrus"
)

type App struct {
	broker    string
	router    *mux.Router
	secretKey string
	username  string
	pipe      mqtt.Client
}

///client
func (a *App) connectAdafruit(broker, username, key string) {
	a.broker = broker
	a.username = username
	a.secretKey = key
	///pie
	a.pipe = a.setupMqttConfig(broker, username, key)

	if token := a.pipe.Connect(); token.Wait() && token.Error() != nil {
		log.WithFields(log.Fields{"error": token.Error()}).Error("Adafruit connection failed")
		return
	}
	a.sub(a.pipe, username, topics.Topics)
}

////Client
func (a *App) InitializeRoutes() {
	a.router = mux.NewRouter()
	a.router.PathPrefix("/").HandlerFunc(func(write http.ResponseWriter, request *http.Request) {
		client.Serve(write, request, a.broker, a.username, a.secretKey)
	})
}

////pipe

func (a *App) setupMqttConfig(broker, username, key string) mqtt.Client {
	opts := mqtt.NewClientOptions()
	opts.AddBroker(fmt.Sprintf("tcp://%s", broker))
	opts.SetClientID(uuid.NewString())
	opts.SetUsername(username)
	opts.SetPassword(key)
	opts.SetCleanSession(false)
	opts.SetAutoReconnect(true)
	opts.SetDefaultPublishHandler(a.messageHandler)
	opts.SetOnConnectHandler(func(c mqtt.Client) {
		log.Info("Adafruit connected")
	})
	opts.SetConnectionLostHandler(func(c mqtt.Client, err error) {
		log.WithFields(log.Fields{"error": err}).Error("Adafruit disconnected")
	})
	opts.SetReconnectingHandler(func(c mqtt.Client, opts *mqtt.ClientOptions) {
		log.Info("Adafruit reconnecting")
	})

	return mqtt.NewClient(opts)
}
func (a *App) messageHandler(client mqtt.Client, msg mqtt.Message) {
	log.WithFields(log.Fields{"topic": msg.Topic()}).Info("Message received")

	var payload map[string]interface{}
	if err := json.Unmarshal(msg.Payload(), &payload); err != nil {
		log.WithFields(log.Fields{"error": err}).Error("Invalid message format")
		return
	}

	if err := api.UpdateTopicData(payload); err != nil {
		log.WithFields(log.Fields{"error": err}).Error("Error calling api UpdateTopicData")
		return
	}
}

func (a *App) sub(client mqtt.Client, username string, topics []string) error {
	for _, topic := range topics {
		if token := client.Subscribe(fmt.Sprintf("%s/feeds/%s", username, topic), 1, nil); token.Wait() && token.Error() != nil {
			log.WithFields(log.Fields{"error": token.Error()}).Error("Error subscribing")
		}
		log.WithFields(log.Fields{"topic": topic}).Info("Subscribed")
	}

	return nil
}

/////Run app
func (a *App) Run_client(address int) {

	port := fmt.Sprintf(":%d", address)

	log.Infof("Listening on port %s", port)
	if err := http.ListenAndServe(port, a.router); err != nil {
		log.WithFields(log.Fields{"error": err}).Fatalf("Failed to listen on port %s", port)
	}

	log.Info("Pipe is running")
	// keepAlive := make(chan struct{})
	// <-keepAlive
}
