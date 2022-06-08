import { DeviceType } from '@/models/devices';

type ValueMappings = {
    [key in DeviceType]: string
};

const deviceDefaultValues: ValueMappings = {
    "buzzer": "B1",
    "fan": "255",
    "gas": "1",
    "power": "OPEN",
    "servo": "OPEN",
    "sprinkler": "W1",
    "temperature": "100",
    "led" : "L1"
};

export default deviceDefaultValues;