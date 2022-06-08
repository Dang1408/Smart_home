export const OUTPUT_DEVICES = [
  {
    name: 'Extractor',
    subtitle: 'Propeller devices', 
    icon: 'fan', 
    deviceType:'fan', 
    protection: true, 
    setting:'Fan speed',
    maxSetting: 255,
    ID: ''
  },
  {
    name: 'Led',
    subtitle: 'Led devices', 
    icon: 'led-outline', 
    deviceType:'led', 
    protection: true, 
    setting:'led',
    maxSetting: 1,
    ID: ''
  },
  { 
    name: 'Sprinkler', 
    subtitle: 'Mini pump devices', 
    icon: 'shower-head', 
    deviceType:'sprinkler', 
    protection: true, 
    setting: 'Sprinkler',
    maxSetting: 1,
    ID: ''
  },
  { 
    name: 'Fire alarm', 
    subtitle: 'buzzer devices', 
    icon: 'bell-ring', 
    deviceType: 'buzzer', 
    protection: true,
    setting: 'Buzzer speaker',
    maxSetting: 1023,
    ID: ''
  },
  { 
    name: 'Smart door', 
    subtitle: 'RC servo devices', 
    icon: 'door-open', 
    deviceType:'servo', 
    protection: true,
    setting: 'Door rotation',
    maxSetting: 180,
    ID: ''
  },
  { 
    name: 'Power', 
    subtitle: 'relay circut', 
    icon: 'flash', 
    deviceType:'power', 
    protection: true,
    setting: 'Power circuit',
    maxSetting: 1,
    ID: ''
  },
];


export type typeItem = {
  name: string, 
  subtitle: string,
  icon: string,
  deviceType: string,
  protection: boolean,
  setting: string,
  maxSetting: number,
  ID: string
}