package models

import (
	"encoding/json"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type User struct {
	Uid         string     `json:"uid" gorm:"primaryKey"`
	DisplayName string     `json:"displayName"`
	Email       string     `json:"email" gorm:"unique"`
	PhoneNumber string     `json:"phoneNumber"`
	Password    string     `json:"password"`
	Invitations []Building `json:"invitations" gorm:"many2many:user_invitations;foreignKey:Uid;joinForeignKey:UserId;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}

func CreateUser(db *gorm.DB, params interface{}) (interface{}, error) {
	id := uuid.New().String()
	var user User = User{Uid: id}

	byteStream, _ := json.Marshal(params)
	///user= User{Uid: id}

	json.Unmarshal(byteStream, &user)

	if err := db.FirstOrCreate(&user).Error; err != nil {
		return nil, err
	}

	return &user, nil
}

func GetUser(db *gorm.DB, params interface{}) (interface{}, error) {
	payload := params.(map[string]interface{})
	email := payload["email"].(string)

	var user User
	if err := db.Where("email = ?", email).First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func GetUserBuildings(db *gorm.DB, params interface{}) (interface{}, error) {
	uid := params.(map[string]interface{})["uid"]

	var b []Building
	if err := db.
		Model(&Building{}).
		Joins("join user_buildings on buildings.name = user_buildings.building_name").
		Where("user_buildings.user_id = ?", uid).
		Preload("Owner").
		Preload("Members").
		Preload("Devices.Data", "time > now()-'1 day'::interval").
		Find(&b).Error; err != nil {
		return nil, err
	}

	return &b, nil
}

func GetInvitations(db *gorm.DB, params interface{}) (interface{}, error) {
	uid := params.(map[string]interface{})["uid"].(string)

	var b []Building
	if err := db.Model(&User{Uid: uid}).Association("Invitations").Find(&b); err != nil {
		return nil, err
	}

	return &b, nil
}

func AcceptInvitation(db *gorm.DB, params interface{}) (interface{}, error) {
	payload := params.(map[string]interface{})
	uid := payload["uid"].(string)
	buildingName := payload["buildingName"].(string)

	u := User{Uid: uid}
	b := Building{Name: buildingName}
	if err := db.Model(&u).Association("Invitations").Delete(&b); err != nil {
		return nil, err
	}

	if err := db.Model(&b).Association("Members").Append(&u); err != nil {
		return nil, err
	}

	if err := db.
		Preload("Owner").
		Preload("Members").
		Preload("Devices.Data", "time > now()-'1 day'::interval").
		First(&b, "name = ?", buildingName).Error; err != nil {
		return nil, err
	}

	return &b, nil
}

func DeclineInvitation(db *gorm.DB, params interface{}) (interface{}, error) {
	payload := params.(map[string]interface{})
	uid := payload["uid"].(string)
	buildingName := payload["buildingName"].(string)

	u := User{Uid: uid}
	b := Building{Name: buildingName}
	if err := db.Model(&u).Association("Invitations").Delete(&b); err != nil {
		return nil, err
	}

	return map[string]interface{}{"success": true}, nil
}
