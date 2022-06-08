import { DeviceType } from '@/models/devices';

type TopicMappings = {
    [key in DeviceType]: string
};

const deviceTopics: TopicMappings = {
    "buzzer": "bk-iot-speaker",
    "fan": "bk-iot-drv",
    "gas": "bk-iot-gas",
    "power": "bk-iot-relay",
    "servo": "bk-iot-servo",
    "sprinkler": "bk-iot-relay",
    "temperature": "bk-iot-temp-humid",
    "led": "bk-iot-led"
};

export default deviceTopics;