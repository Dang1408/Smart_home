package models

import (
	"encoding/json"

	"github.com/Dang1408/Smart_homedata/data/api"

	"gorm.io/gorm"
)

type Building struct {
	Address string   `json:"address"`
	Devices []Device `json:"devices" gorm:"foreignKey:Building;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Name    string   `json:"name" gorm:"primaryKey"`
	Members []User   `json:"members" gorm:"many2many:user_buildings;references:Iduser;joinReferences:UID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	OwnerID string   `json:"ownerId"`
	Owner   User     `json:"owner" gorm:"foreignKey:OwnerID"`
}

func CreateBuilding(db *gorm.DB, params interface{}) (interface{}, error) {
	var build Building
	byteStream, _ := json.Marshal(params)
	json.Unmarshal(byteStream, &build)

	if err := db.Create(&build).Error; err != nil {
		return nil, err
	}

	if err := api.UpdateProtection(build.Devices); err != nil {
		return nil, err
	}

	return &build, nil
}

func GetBuilding(db *gorm.DB, params interface{}) (interface{}, error) {
	payload := params.(map[string]interface{})
	buildingName := payload["buildingName"].(string)

	var build Building
	///retrieving an object into build and try error
	if err := db.
		Preload("Devices").
		Preload("Owner").
		Preload("Members").
		First(&build, "name = ?", buildingName).Error; err != nil {
		return nil, err
	}

	return &build, nil
}

func InviteUser(db *gorm.DB, params interface{}) (interface{}, error) {
	payload := params.(map[string]interface{})
	email := payload["email"].(string)
	buildingName := payload["buildingName"].(string)

	var u User
	if err := db.Where("email = ?", email).First(&u).Error; err != nil {
		return nil, err
	}

	b := Building{Name: buildingName}
	if err := db.Model(&u).Association("Invitations").Append(&b); err != nil {
		return nil, err
	}

	return map[string]interface{}{"success": true}, nil
}

func KickUser(db *gorm.DB, params interface{}) (interface{}, error) {
	payload := params.(map[string]interface{})
	uid := payload["uid"].(string)
	buildingName := payload["buildingName"].(string)

	u := User{Iduser: uid}
	b := Building{Name: buildingName}
	if err := db.Model(&b).Association("Members").Delete(&u); err != nil {
		return nil, err
	}

	return map[string]interface{}{"success": true}, nil
}

func AddBuildingDevice(db *gorm.DB, params interface{}) (interface{}, error) {
	payload := params.(map[string]interface{})
	buildingName := payload["buildingName"].(string)

	var d Device
	b, _ := json.Marshal(payload["device"])
	json.Unmarshal(b, &d)

	d.Building = buildingName

	if err := db.Create(&d).Error; err != nil {
		return nil, err
	}

	var devices []Device
	if err := db.
		Model(&Device{}).
		Where("building = ? and region = ?", d.Building, d.Region).
		Find(&devices).Error; err != nil {
		return nil, err
	}

	if err := api.UpdateProtection(devices); err != nil {
		return nil, err
	}

	return &d, nil
}

func CloseBuilding(db *gorm.DB, params interface{}) (interface{}, error) {
	payload := params.(map[string]interface{})
	buildingName := payload["buildingName"].(string)

	if err := db.Delete(&Building{}, "name = ?", buildingName).Error; err != nil {
		return nil, err
	}

	return map[string]interface{}{"success": true}, nil
}
