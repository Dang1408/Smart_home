import { Building, Device, Message, User, ProtectionMessage } from '@/models';

export enum ActionType {
  ADD_BUILDING = "ADD_BUILDING",
  ADD_DEVICE = "ADD_DEVICE",
  REMOVE_BUILDING = "REMOVE_BUILDING",
  REMOVE_INVITATION = "REMOVE_INVITATION",
  REMOVE_USER = "REMOVE_USER",
  RESET_BUILDING_SETTINGS = "RESET_BUILDING_SETTINGS",
  RESET_STATE = "RESET_STATE",
  SET_BUILDINGS = "SET_BUILDINGS",
  SET_CONNECTION = "SET_CONNECTION",
  SET_CURRENT_USER = "SET_CURRENT_USER",
  SET_DEFAULT_BUILDING = "SET_DEFAULT_BUILDING",
  SET_INVITATIONS = "SET_INVITATIONS",
  UPDATE_BUILDING_SETTINGS = "UPDATE_BUILDING_SETTINGS",
  UPDATE_DATA = "UPDATE_DATA",
  UPDATE_PROTECTION = "UPDATE_PROTECTION"
};

export interface Action {
  type: ActionType,
  payload?: any
};

const actions = {
  addBuilding: (payload: Building): Action => ({ type: ActionType.ADD_BUILDING, payload: payload }),
  addDevice: (payload: Device): Action => ({ type: ActionType.ADD_DEVICE, payload: payload }),
  removeBuilding: (payload: string): Action => ({ type: ActionType.REMOVE_BUILDING, payload: payload }),
  removeInvitation: (payload: string): Action => ({ type: ActionType.REMOVE_INVITATION, payload: payload }),
  removeUser: (payload: string): Action => ({ type: ActionType.REMOVE_USER, payload: payload }),
  resetState: (): Action => ({ type: ActionType.RESET_STATE }),
  setBuildings: (payload: Building[]): Action => ({ type: ActionType.SET_BUILDINGS, payload: payload }),
  setConnection: (payload: boolean): Action => ({ type: ActionType.SET_CONNECTION, payload: payload }),
  setCurrentUser: (payload: User): Action => ({ type: ActionType.SET_CURRENT_USER, payload: payload }),
  setDefaultBuilding: (payload?: Building): Action => ({ type: ActionType.SET_DEFAULT_BUILDING, payload: payload }),
  setInvitations: (payload: string[]): Action => ({ type: ActionType.SET_INVITATIONS, payload: payload }),
  updateData: (payload: Message): Action => ({ type: ActionType.UPDATE_DATA, payload: payload }),
  updateProtection: (payload: ProtectionMessage): Action => ({ type: ActionType.UPDATE_PROTECTION, payload: payload })
};

export default actions;