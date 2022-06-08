import Device from '@/models/devices';
import User from '@/models/users';

export default interface Building {
  name: string,
  address?: string,
  devices: Device[],
  members?: User[],
  owner: User | null
};