package main

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/Dang1408/Smart_homedata/data/models"

	log "github.com/sirupsen/logrus"

	"github.com/gorilla/mux"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type App struct {
	DB     *gorm.DB
	Router *mux.Router
}

func (a *App) ConnectPostgres(user, password, dbname, host string) {
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s sslmode=disable", host, user, password, dbname)

	var err error
	a.DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.WithFields(log.Fields{
			"error": err,
			"dsn":   dsn,
		}).Fatal("Error creating DB")
	}

	if err := a.DB.AutoMigrate(
		&models.User{},
		&models.Building{},
		&models.Device{},
		&models.Data{},
	); err != nil {
		log.WithFields(log.Fields{"error": err}).Fatal("Error migrating DB")
	}
}

func (a *App) InitializeRoutes() {
	a.Router = mux.NewRouter()
	a.Router.HandleFunc("/acceptInvitation", a.acceptInvitation).Methods("POST")   ///tested
	a.Router.HandleFunc("/addBuildingDevice", a.addBuildingDevice).Methods("POST") ///tested
	a.Router.HandleFunc("/closeBuilding", a.closeBuilding).Methods("POST")         ////tested
	a.Router.HandleFunc("/createUser", a.createUser).Methods("POST")               ///tested
	a.Router.HandleFunc("/createBuilding", a.createBuilding).Methods("POST")       ///tested
	a.Router.HandleFunc("/declineInvitation", a.declineInvitation).Methods("POST") ///tested
	a.Router.HandleFunc("/getBuilding", a.getBuilding).Methods("POST")             ////tested
	a.Router.HandleFunc("/getInputDevices", a.getInputDevices).Methods("POST")     ////tested
	a.Router.HandleFunc("/getInvitations", a.getInvitations).Methods("POST")       ////tested
	a.Router.HandleFunc("/getOutputDevices", a.getOutputDevices).Methods("POST")   ////tested
	a.Router.HandleFunc("/getUserBuildings", a.getUserBuildings).Methods("POST")   ////tested
	a.Router.HandleFunc("/inviteUser", a.inviteUser).Methods("POST")               ////tested
	a.Router.HandleFunc("/kickUser", a.kickUser).Methods("POST")                   ////tested
	a.Router.HandleFunc("/updateData", a.updateData).Methods("POST")               ////tested
	a.Router.HandleFunc("/updateProtection", a.updateProtection).Methods("POST")   ////tested
	a.Router.HandleFunc("/ping", a.ping).Methods("GET")                            ////tested
}

func (a *App) acceptInvitation(w http.ResponseWriter, r *http.Request) {
	a.handleRequest(w, r, map[string]string{}, models.AcceptInvitation)
}

func (a *App) addBuildingDevice(w http.ResponseWriter, r *http.Request) {
	a.handleRequest(w, r, map[string]interface{}{}, models.AddBuildingDevice)
}

func (a *App) closeBuilding(w http.ResponseWriter, r *http.Request) {
	a.handleRequest(w, r, map[string]string{}, models.CloseBuilding)
}

func (a *App) createUser(w http.ResponseWriter, r *http.Request) {
	a.handleRequest(w, r, models.User{}, models.CreateUser)
}

func (a *App) createBuilding(w http.ResponseWriter, r *http.Request) {
	a.handleRequest(w, r, models.Building{}, models.CreateBuilding)
}

func (a *App) declineInvitation(w http.ResponseWriter, r *http.Request) {
	a.handleRequest(w, r, map[string]string{}, models.DeclineInvitation)
}

func (a *App) getBuilding(w http.ResponseWriter, r *http.Request) {
	a.handleRequest(w, r, map[string]string{}, models.GetBuilding)
}

func (a *App) getInputDevices(w http.ResponseWriter, r *http.Request) {
	a.handleRequest(w, r, nil, models.GetInputDevices)
}

func (a *App) getInvitations(w http.ResponseWriter, r *http.Request) {
	a.handleRequest(w, r, map[string]string{}, models.GetInvitations)
}

func (a *App) getOutputDevices(w http.ResponseWriter, r *http.Request) {
	a.handleRequest(w, r, map[string]string{}, models.GetOutputDevices)
}

func (a *App) getUserBuildings(w http.ResponseWriter, r *http.Request) {
	a.handleRequest(w, r, map[string]string{}, models.GetBuilding)
}

func (a *App) inviteUser(w http.ResponseWriter, r *http.Request) {
	a.handleRequest(w, r, map[string]string{}, models.InviteUser)
}

func (a *App) kickUser(w http.ResponseWriter, r *http.Request) {
	a.handleRequest(w, r, map[string]string{}, models.KickUser)
}

func (a *App) updateData(w http.ResponseWriter, r *http.Request) {
	a.handleRequest(w, r, map[string]string{}, models.UpdateData)
}

func (a *App) updateProtection(w http.ResponseWriter, r *http.Request) {
	a.handleRequest(w, r, map[string]interface{}{}, models.UpdateProtection)
}

func (a *App) ping(w http.ResponseWriter, r *http.Request) {
	a.respond(w, http.StatusOK, "Pong")
}

func (a *App) handleRequest(w http.ResponseWriter, r *http.Request, body interface{}, handler func(*gorm.DB, interface{}) (interface{}, error)) {
	if body != nil {
		decoder := json.NewDecoder(r.Body)
		if err := decoder.Decode(&body); err != nil {
			log.WithFields(log.Fields{"error": err}).Error("Error decoding payload")
			a.respond(w, http.StatusBadRequest, err.Error())
			return
		}
		defer r.Body.Close()
	}

	response, err := handler(a.DB, body)
	if err != nil {
		log.WithFields(log.Fields{"error": err}).Error("Error handling request %s", r.URL)
		a.respond(w, http.StatusInternalServerError, err.Error())
		return
	}
	a.respond(w, http.StatusOK, response)
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
	if err := http.ListenAndServe(port, a.Router); err != nil {
		log.WithFields(log.Fields{"error": err}).Fatalf("Failed to listen on port %s", port)
	}
}
