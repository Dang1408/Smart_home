package models

import (
	"errors"
	"time"

	"gorm.io/gorm"
)

type Data struct {
	Device string    `json:"device" gorm:"primaryKey"`
	Time   time.Time `json:"time" gorm:"primaryKey"`
	Value  string    `json:"value"`
}

func UpdateData(db *gorm.DB, params interface{}) (interface{}, error) {
	payload := params.(map[string]interface{})

	var d Device
	if err := db.Where("name = ?", payload["name"].(string)).First(&d).Error; errors.Is(err, gorm.ErrRecordNotFound) {
		return map[string]interface{}{"success": true}, nil
	} else if err != nil {
		return nil, err
	}

	data := map[string]interface{}{
		"Device": payload["name"],
		"Time":   time.Now(),
		"Value":  payload["data"],
	}

	if err := db.Model(&Data{}).Create(data).Error; err != nil {
		return nil, err
	}

	return map[string]interface{}{"success": true}, nil
}
