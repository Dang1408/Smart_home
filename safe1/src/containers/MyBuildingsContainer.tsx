import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { CreateBuilding, MyBuildings } from '@/views';

import { connect, ConnectedProps } from 'react-redux';
import { State } from '@/redux/state';
import { Building } from '@/models';

const mapStateToProps = (state: State) => ({
  defaultBuilding: state.defaultBuilding
});

const connector = connect(mapStateToProps);

interface Props extends ConnectedProps<typeof connector> {
  defaultBuilding: Building | undefined
};

const { Navigator, Screen } = createStackNavigator();

class MyBuildingsContainer extends React.Component<Props> {
  render() {
    return (
      <Navigator 
        headerMode="none"
        initialRouteName="My Buildings"
      >
        <Screen name="Create Building" component={CreateBuilding} />
        <Screen name="My Buildings" component={MyBuildings} />
      </Navigator>
    );
  }
};

export default connector(MyBuildingsContainer);