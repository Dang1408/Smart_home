package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"strings"

	mqtt "github.com/eclipse/paho.mqtt.golang"
	"github.com/google/uuid"
	"github.com/gorilla/mux"
	log "github.com/sirupsen/logrus"

	"github.com/Dang1408/Smart_home/auto/api"
	"github.com/Dang1408/Smart_home/auto/utils"
)

type App struct {
	auto       mqtt.Client // CSE_BBC
	protection map[string]interface{}
	router     *mux.Router
	username   string
}

func (a *App) Initialize(broker, username, key string) {
	a.setupProtectionPolicy()

	a.auto = a.setupMqttConfig(broker, username, key)
	if token := a.auto.Connect(); token.Wait() && token.Error() != nil {
		log.WithFields(log.Fields{"error": token.Error()}).Error("Auto connection failed")
		return
	}
	a.username = username
	a.sub(a.auto, username, "gas")
	a.initializeRoutes()
}

func (a *App) setupProtectionPolicy() {
	a.protection = map[string]interface{}{}

	inputDevices, err := api.GetInputDevices()
	if err != nil {
		log.WithFields(log.Fields{"error": err}).Error("Error fetching input devices")
		return
	}

	for _, inputDevice := range inputDevices {
		inputName := inputDevice["name"].(string)
		building := inputDevice["building"].(string)
		region := inputDevice["region"].(string)

		a.protection[inputName] = make([]map[string]interface{}, 0)
		outputDevices, err := api.GetOutputDevices(map[string]interface{}{"building": building, "region": region})
		if err != nil {
			log.WithFields(log.Fields{"error": err}).Error("Error fetching input devices")
			return
		}
		for _, outputDevice := range outputDevices {
			outputInfo := map[string]interface{}{
				"name":       outputDevice["name"].(string),
				"topic":      outputDevice["topic"].(string),
				"type":       outputDevice["deviceType"].(string),
				"protection": outputDevice["protection"].(bool),
				////add triggervalue
				"triggeredValue": outputDevice["triggeredValue"].(string),
			}
			a.protection[inputName] = append(a.protection[inputName].([]map[string]interface{}), outputInfo)
		}
	}
}

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
		log.Info("Auto connected")
	})
	opts.SetConnectionLostHandler(func(c mqtt.Client, err error) {
		log.WithFields(log.Fields{"error": err}).Error("Auto disconnected")
	})
	opts.SetReconnectingHandler(func(c mqtt.Client, opts *mqtt.ClientOptions) {
		log.Info("Auto reconnecting")
	})

	return mqtt.NewClient(opts)
}

func (a *App) messageHandler(client mqtt.Client, msg mqtt.Message) {
	s := strings.Split(msg.Topic(), "/")
	////fmt.Print("check topic: %d", s)
	b := msg.Payload()
	var data map[string]interface{}
	json.Unmarshal(b, &data)
	if topic := s[len(s)-1]; topic == "gas" {
		value, err := strconv.Atoi(data["data"].(string))
		if err != nil {
			log.WithFields(log.Fields{"error": err}).Error("Error parsing message")
		}
		if value >= utils.GAS_THRESHOLD {
			name := data["name"].(string)
			///fmt.Print(data)
			a.triggerProtection(name)
		}
	}
	// else if topic == "humid" {
	// 	strVal := strings.Split(data["data"].(string), "-")[0]
	// 	value, err := strconv.Atoi(strVal)
	// 	if err != nil {
	// 		log.WithFields(log.Fields{"error": err}).Error("Error parsing message")
	// 	}
	// 	if value >= utils.TEMP_THRESHOLD {
	// 		name := data["name"].(string)
	// 		a.triggerProtection(name)
	// 	}
	// } else if topic == "temp" {
	// 	strVal := strings.Split(data["data"].(string), "-")[0]
	// 	value, err := strconv.Atoi(strVal)
	// 	if err != nil {
	// 		log.WithFields(log.Fields{"error": err}).Error("Error parsing message")
	// 	}
	// 	if value >= utils.TEMP_THRESHOLD {
	// 		name := data["name"].(string)
	// 		a.triggerProtection(name)
	// 	}
	// }
}

func (a *App) triggerProtection(inputName string) {
	deviceList, ok := a.protection[inputName].([]map[string]interface{})
	if !ok {
		log.WithFields(log.Fields{"name": inputName}).Warn("Input device not found")
		return
	}
	for _, device := range deviceList {
		////fmt.Print("CHECK TRIGGER PROTECTION ")
		////fmt.Print(device)
		if protection, ok := device["protection"].(bool); ok && protection {
			topic := device["topic"].(string)
			deviceName := device["name"].(string)
			deviceType := device["type"].(string)
			/////devices doesn't have triggervalue
			value := device["triggeredValue"].(string)
			msg := utils.GetProtectionMessage(deviceName, deviceType, value)
			/////fmt.Print("CHECK TRIGGER PROTECTION 2 ")
			if utils.FindTopic(topic, utils.Topics) {
				if err := a.pub(a.auto, a.username, topic, msg); err != nil {
					log.WithFields(log.Fields{"error": err}).Error("Error publishing message")
				}
			}
		}
	}
}

func (a *App) sub(client mqtt.Client, username string, topics ...string) error {
	for _, topic := range topics {
		if token := client.Subscribe(fmt.Sprintf("%s/feeds/%s", username, topic), 1, nil); token.Wait() && token.Error() != nil {
			log.WithFields(log.Fields{"error": token.Error()}).Error("Error subscribing")
		}
		log.WithFields(log.Fields{"topic": topic}).Info("Subscribed")
	}

	return nil
}

func (a *App) pub(client mqtt.Client, username, topic string, msg interface{}) error {
	b, _ := json.Marshal(msg)
	if token := client.Publish(fmt.Sprintf("%s/feeds/%s", username, topic), 0, false, string(b)); token.Wait() && token.Error() != nil {
		return token.Error()
	}
	log.WithFields(log.Fields{"topic": topic}).Info("Published")
	return nil
}

func (a *App) initializeRoutes() {
	a.router = mux.NewRouter()
	a.router.HandleFunc("/updateProtection", a.updateProtectionPolicy).Methods("POST")
}

func (a *App) updateProtectionPolicy(w http.ResponseWriter, r *http.Request) {
	var body []map[string]interface{}

	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&body); err != nil {
		log.WithFields(log.Fields{"error": err}).Error("Error decoding payload")
		a.respond(w, http.StatusBadRequest, err.Error())
		return
	}
	defer r.Body.Close()

	inputDevices := make([]string, 0)
	outputDevices := make([]map[string]interface{}, 0)
	for _, device := range body {
		deviceType := device["deviceType"].(string)
		if deviceType == "gas" || deviceType == "temperature" {
			inputDevices = append(inputDevices, device["name"].(string))
		} else {
			deviceInfo := map[string]interface{}{
				"name":           device["name"].(string),
				"topic":          device["topic"].(string),
				"type":           device["deviceType"].(string),
				"protection":     device["protection"].(bool),
				"triggeredValue": device["triggeredValue"].(string),
			}
			outputDevices = append(outputDevices, deviceInfo)
		}
	}

	for _, name := range inputDevices {
		a.protection[name] = outputDevices
	}

	a.respond(w, http.StatusOK, map[string]interface{}{"success": true})
}

func (a *App) respond(w http.ResponseWriter, code int, payload interface{}) {
	response, _ := json.Marshal(payload)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	w.Write(response)
}

func (a *App) Run(address int) {
	port := fmt.Sprintf(":%d", address)

	log.Infof("Listening on port %s", port)
	if err := http.ListenAndServe(port, a.router); err != nil {
		log.WithFields(log.Fields{"error": err}).Fatalf("Failed to listen on port %s", port)
	}
}
