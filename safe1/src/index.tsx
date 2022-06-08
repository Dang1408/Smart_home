import React from 'react';
import { AppState, AppStateStatus, StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import Safe1Container from '@/containers';
import ControlService from '@/services/control.service';
import StorageService from '@/services/storage.service';
import store from '@/redux/store';

export default class Safe1 extends React.Component {
  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);
    StatusBar.setBackgroundColor('transparent');
    StatusBar.setTranslucent(true);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (nextAppState === 'background' || nextAppState === 'inactive') {
      StorageService.setUser(store.getState().currentUser);
      StorageService.setBuildings(store.getState().buildings);
      if (store.getState().defaultBuilding) StorageService.setDefaultBuilding(store.getState().defaultBuilding);
      ControlService.close();
    }
  }

  render() {
    return (
      <Provider store={store}>
        <Safe1Container />
      </Provider>
    );
  }
};