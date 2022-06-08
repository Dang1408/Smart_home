package main

import (
	"fmt"
	"net/http"

	log "github.com/sirupsen/logrus"

	"github.com/Dang1408/safe1/services/control/client"
	"github.com/gorilla/mux"
)

type App struct {
	broker    string
	router    *mux.Router
	secretKey string
	username  string
}

func (a *App) SetupAdafruitConfig(broker, username, key string) {
	a.broker = broker
	a.username = username
	a.secretKey = key
}

func (a *App) InitializeRoutes() {
	a.router = mux.NewRouter()
	a.router.PathPrefix("/").HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		client.Serve(w, r, a.broker, a.username, a.secretKey)
	})
}

func (a *App) Run(address int) {
	port := fmt.Sprintf(":%d", address)

	log.Infof("Listening on port %s", port)
	if err := http.ListenAndServe(port, a.router); err != nil {
		log.WithFields(log.Fields{"error": err}).Fatalf("Failed to listen on port %s", port)
	}
}
