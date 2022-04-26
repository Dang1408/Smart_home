package utils

var Topics = []string{

	"buzzer",
	"led",
	"gas",
}

var Topics1 = []string{
	"buzzer",
	"led",
	"temp",
}

func FindTopic(topic string, topicList []string) bool {
	for _, t := range topicList {
		if t == topic {
			return true
		}
	}
	return false
}
