package utils

var TriggerProtection = map[string]interface{}{
	"buzzer": map[string]string{
		"id":   "3",
		"unit": "",
	},
	"fan": map[string]string{
		"id":   "10",
		"unit": "",
	},
	"power": map[string]string{
		"id":   "11",
		"unit": "",
	},
	"sprinkler": map[string]string{
		"id":   "11",
		"unit": "",
	},
	"servo": map[string]string{
		"id":   "17",
		"unit": "degree",
	},
}

func GetProtectionMessage(deviceName, deviceType string, triggeredValue string) map[string]string {
	if msgTemplate, ok := TriggerProtection[deviceType].(map[string]string); ok {
		return map[string]string{
			"id":   msgTemplate["id"],
			"name": deviceName,
			"data": triggeredValue,
			"unit": msgTemplate["unit"],
		}
	}

	return nil
}
