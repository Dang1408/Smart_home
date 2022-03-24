package topics

var Topics = []string{
	"bk-iot-led",
	"bk-iot-speaker",
	"bk-iot-temp-humid",
	"bk-iot-drv",
}

var Topics1 = []string{
	"bk-iot-relay",
	"bk-iot-servo",
	"bk-iot-gas",
}

func FindTopic(topic string, topicList []string) bool {
	for _, t := range topicList {
		if t == topic {
			return true
		}
	}
	return false
}
