import { Building, User } from '@/models';

export type State = {
  currentUser: User | null,
  buildings: Building[],
  defaultBuilding?: Building,
  invitations: string[],
  isConnected: boolean
};

const initialState: State = {
  currentUser: null,
  buildings: [],
  invitations: [],
  isConnected: false
};

export default initialState;