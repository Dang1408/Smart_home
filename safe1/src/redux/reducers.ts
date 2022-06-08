import { Reducer } from '@reduxjs/toolkit';
import { Action, ActionType } from '@/redux/actions';
import initialState, { State } from '@/redux/state';
import { Building, Device, User } from '@/models';

const reducer: Reducer<State, Action> = (state=initialState, action: Action): State => {
  switch(action.type) {
  case ActionType.ADD_BUILDING:
    return { ...state, buildings: [ ...state.buildings, action.payload ] };
  case ActionType.ADD_DEVICE:
    return { 
      ...state, 
      defaultBuilding: state.defaultBuilding ? {
        ...state.defaultBuilding,
        devices: [...state.defaultBuilding.devices, action.payload]
      } : undefined
    };
  case ActionType.REMOVE_BUILDING:
    return { ...state, buildings: state.buildings.filter((building: Building) => building.name !== action.payload) };
  case ActionType.REMOVE_INVITATION:
    return { ...state, invitations: state.invitations.filter((buildingName: string) => buildingName !== action.payload) };
  case ActionType.REMOVE_USER:
    return { 
      ...state, 
      defaultBuilding: state.defaultBuilding ? {
        ...state.defaultBuilding,
        members: state.defaultBuilding.members?.filter((member: User) => member.uid !== action.payload)
      } : undefined
    };
  case ActionType.RESET_STATE:
    return initialState;
  case ActionType.SET_BUILDINGS:
    return { ...state, buildings: action.payload };
  case ActionType.SET_CONNECTION:
    return { ...state, isConnected: action.payload };
  case ActionType.SET_CURRENT_USER:
    return { ...state, currentUser: action.payload };
  case ActionType.SET_DEFAULT_BUILDING:
    return { 
      ...state,
      buildings: state.buildings.map((building: Building) => 
        building.name === state.defaultBuilding?.name ? state.defaultBuilding : building
      ),
      defaultBuilding: action.payload
    };
  case ActionType.SET_INVITATIONS:
    return { ...state, invitations: action.payload };
  case ActionType.UPDATE_DATA:
    let { name, data } = action.payload;
    if (name === undefined || data === undefined) return state;
    let buildings = state.buildings.map((building: Building) => ({ 
      ...building, 
      devices: building.devices.map((device: Device) =>
        device.name === name ? 
          { ...device, 
            data: [ 
              ...(device.data || []), 
              { time: new Date(), value: data } 
            ] 
          } : device)
    }));
    let defaultBuilding = state.defaultBuilding ? { 
      ...state.defaultBuilding, 
      devices: state.defaultBuilding.devices.map((device: Device) =>
        device.name === name ? 
          { ...device, 
            data: [ 
              ...(device.data || []), 
              { time: new Date(), value: data } 
            ] 
          } : device)
    } : undefined;
    return { ...state, buildings: buildings, defaultBuilding: defaultBuilding };
  case ActionType.UPDATE_PROTECTION:
    let { _name, protection, triggeredValue } = action.payload;
    if (_name === undefined || protection === undefined || triggeredValue === undefined) return state;
    return { 
      ...state, 
      defaultBuilding: state.defaultBuilding ? { 
        ...state.defaultBuilding, 
        devices: state.defaultBuilding.devices.map((device: Device) =>
          device.name === _name ? 
            { ...device, 
              protection: protection,
              triggeredValue: triggeredValue 
            } : device)
      } : undefined 
    };
  default:
    return state;
  }
};

export default reducer;