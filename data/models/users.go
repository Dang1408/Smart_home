package models

import (
	"encoding/json"

	"gorm.io/gorm"
)

type User struct {
	Iduser       string     `json:"iduser" gorm:"primaryKey"`
	Email        string     `json: "email"`
	Phone_number string     `json: "phonenumber"`
	Avatar       string     `json: "avatarURL"`
	Invitations  []Building `json:"invitations" gorm:"many2many:user_invitation;foreignKey:Iduser;joinForeignKey:UID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}

func CreateUser(db *gorm.DB, params interface{}) (interface{}, error) {
	var user User
	byteStream, _ := json.Marshal(params)
	json.Unmarshal(byteStream, &user)

	if err := db.FirstOrCreate(&user).Error; err != nil {
		return nil, err
	}

	return &user, nil
}

func Getbuilding(db *gorm.DB, params interface{}) (interface{}, error) {
	id_user := params.(map[string]interface{})["iduser"]

	var b []Building
	///check query
	err := db.Model(&Building{}).
		Joins("join user_buildings on buildings.name = user_buildings.building_name").
		Where("user_buildins.user_id = ?", id_user).
		Preload("Owner").
		Preload("Member").
		Preload("Devices.Data", "time > now()-'1 day'::interval").
		Find(&b).Error
	if err != nil {
		return nil, err
	}

	return &b, nil
}

func GetInvitations(db *gorm.DB, params interface{}) (interface{}, error) {
	id_user := params.(map[string]interface{})["iduser"].(string)

	var b []Building
	///get b
	err := db.Model(&User{Iduser: id_user}).
		Association("Invitations").
		Find(&b)

	if err != nil {
		return nil, err
	}
	return &b, nil
}

func AcceptInvitation(db *gorm.DB, params interface{}) (interface{}, error) {
	load := params.(map[string]interface{})
	id_user := load["iduser"].(string)
	build_name := load["buildingName"].(string)

	user := User{Iduser: id_user}
	building := Building{Name: build_name}

	err1 := db.Model(&user).
		Association("Invitations").Delete(&building)

	if err1 != nil {
		return nil, err1
	}

	err2 := db.Model(&building).
		Association("Members").Append(&user)

	if err2 != nil {
		return nil, err2
	}

	err3 := db.
		Preload("Owner").
		Preload("Members").
		Preload("Devices.Data", "time > now() - '1 day'::interval").
		First(&building, "name = ?", build_name).Error

	if err3 != nil {
		return nil, err3
	}

	return &building, nil
}

func DeclineInvitation(db *gorm.DB, params interface{}) (interface{}, error) {
	load := params.(map[string]interface{})
	id_user := load["iduser"].(string)
	build_name := load["buildingName"].(string)

	user := User{Iduser: id_user}
	building := Building{Name: build_name}
	///WHy
	err1 := db.Model(&user).
		Association("Invitations").Delete(&building)

	if err1 != nil {
		return nil, err1
	}

	return map[string]interface{}{"success": true}, nil
}
