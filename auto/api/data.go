package api

import (
	"bytes"
	"encoding/json"
	"errors"
	"io/ioutil"
	"net/http"
	"os"

	log "github.com/sirupsen/logrus"
)

var dataUrl = os.Getenv("DATA_SERVICE_URL")

func send(route string, payload map[string]interface{}) ([]byte, int, error) {
	postBody, _ := json.Marshal(payload)
	body := bytes.NewBuffer(postBody)
	res, err := http.Post(dataUrl+route, "application/json", body)
	if err != nil {
		return nil, 0, err
	}
	defer res.Body.Close()

	log.WithFields(log.Fields{
		"statusCode": res.StatusCode,
		"status":     res.Status,
	}).Info("Response received from data service")

	b, _ := ioutil.ReadAll(res.Body)
	if res.StatusCode < 300 {
		return b, res.StatusCode, nil
	} else {
		return nil, res.StatusCode, errors.New(res.Status)
	}
}

func GetInputDevices() ([]map[string]interface{}, error) {
	res, _, err := send("/getInputDevices", nil)
	if err != nil {
		return nil, err
	}

	var devices []map[string]interface{}
	if err := json.Unmarshal(res, &devices); err != nil {
		return nil, err
	}

	return devices, nil
}

func GetOutputDevices(data map[string]interface{}) ([]map[string]interface{}, error) {
	res, _, err := send("/getOutputDevices", data)
	if err != nil {
		return nil, err
	}

	var devices []map[string]interface{}
	if err := json.Unmarshal(res, &devices); err != nil {
		return nil, err
	}

	return devices, nil
}
