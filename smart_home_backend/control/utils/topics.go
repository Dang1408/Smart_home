package utils

var Topics = []string{
	"bk-iot-servo",
	"bk-iot-speaker",
	"bk-iot-gas",
}

var Topics1 = []string{
	"bk-iot-led",
	"bk-iot-relay",
	"bk-iot-temp-humid",
}

func FindTopic(topic string, topicList []string) bool {
	for _, t := range topicList {
		if t == topic {
			return true
		}
	}
	return false
}
