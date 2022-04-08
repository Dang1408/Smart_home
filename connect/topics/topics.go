package topics

var Topics = []string{
	//"humid",
	// "temp",
	"buzzer",
	"servo",
	"gas",
}

// var Topics1 = []string{
// 	"bk-iot-relay",
// 	"bk-iot-servo",
// 	"bk-iot-gas",
// }

func FindTopic(topic string, topicList []string) bool {
	for _, t := range topicList {
		if t == topic {
			return true
		}
	}
	return false
}
