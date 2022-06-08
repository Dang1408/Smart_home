export type DeviceType = "buzzer" | "power" | "servo" | "sprinkler" | "fan" | "gas" | "temperature" | "led";

export default interface Device {
  name: string,
  topic: string,
  deviceType: DeviceType,
  region: string,
  protection: boolean,
  triggeredValue: string,
  data: { time: Date, value: string }[]
};