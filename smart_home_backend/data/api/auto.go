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

var autoUrl = os.Getenv("AUTO_SERVICE_URL")

func send(route string, payload interface{}) ([]byte, int, error) {
	postBody, _ := json.Marshal(payload)
	body := bytes.NewBuffer(postBody)
	res, err := http.Post(autoUrl+route, "application/json", body)
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

func UpdateProtection(data interface{}) error {
	_, _, err := send("/updateProtection", data)
	if err != nil {
		return err
	}

	return nil
}
