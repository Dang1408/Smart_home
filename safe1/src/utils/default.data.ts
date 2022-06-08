export const DEFAULT = [
  {
    title: 'Kitchen',
    num: '0',
    illustration: require('@/assets/rooms/kitchen.jpg')
  },
  {
    title: 'Living room',
    num: '0',
    illustration: require('@/assets/rooms/livingroom.jpg')
  },
  {
    title: 'Bedroom',
    num: '0',
    illustration: require('@/assets/rooms/bedroom.jpeg')
  },
  {
    title: 'Bathroom',
    num: '0',
    illustration: require('@/assets/rooms/bathroom.jpg')
  },
  {
    title: 'Basement',
    num: '0',
    illustration: require('@/assets/rooms/basement.jpg')
  }
];

export const REGION = [
  "kitchen",
  "living room",
  "bedroom",
  "bathroom",
  "basement",
]


export type data = {
  title: string, 
  num: string,
  illustration: Object
}
