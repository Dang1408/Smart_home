import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Building, User } from '@/models';
import { State } from '@/redux/state';
import actions, { Action } from '@/redux/actions';
import MainContainer from '@/containers/MainContainer';
import SignInContainer from '@/containers/SignInContainer';
import ControlService from '@/services/control.service';
import DataService from '@/services/data.service';
import StorageService from '@/services/storage.service';

const mapStateToProps = (state: State) => ({
  currentUser: state.currentUser,
  buildings: state.buildings,
  defaultBuilding: state.defaultBuilding
});

const mapDispatchToProps = {
  setBuildings: actions.setBuildings,
  setCurrentUser: actions.setCurrentUser,
  setDefaultBuilding: actions.setDefaultBuilding
};

const connector = connect(mapStateToProps, mapDispatchToProps);

interface Props extends ConnectedProps<typeof connector> {
  currentUser: User | null,
  buildings: Building[],
  defaultBuilding: Building | undefined,
  setBuildings: (payload: Building[]) => Action,
  setCurrentUser: (payload: User) => Action,
  setDefaultBuilding: (payload?: Building) => Action
};

class Safe1Container extends React.Component<Props> {
  async componentDidMount() {
    let user = await StorageService.getUser();
    if (user === null) return;
    this.props.setCurrentUser(user as User);
    let buildings = await DataService.getUserBuildings({ uid: user.uid });
    if (buildings === null) {
      buildings = await StorageService.getBuildings();
      if (buildings === null) return;
    }
    this.props.setBuildings(buildings as Building[]);
    if (buildings.length === 0) return;
    buildings.forEach((building: Building) => ControlService.sub(building));
    let defaultBuilding = await StorageService.getDefaultBuilding();
    if (defaultBuilding === null) return;
    this.props.setDefaultBuilding(defaultBuilding as Building);
  }

  render() {
    return (this.props.currentUser ? <MainContainer/> : <SignInContainer/>);
  }
};

export default connector(Safe1Container);