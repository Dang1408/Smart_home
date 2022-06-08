import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MyBuildingsContainer from '@/containers/MyBuildingsContainer';
import { 
  Home, 
  Dashboard, 
  NotificationHistory, 
  NotificationDaily, 
  RemoteControl, 
  OptionScreen,
  RoomScreen 
} from '@/views';
import { Alert } from 'react-native';
import { Building } from '@/models'
import { connect, ConnectedProps } from 'react-redux';
import { State } from '@/redux/state';
import {splitDataValue} from '@/views/NotificationDaily';

const { Navigator, Screen } = createStackNavigator();

const mapStateToProps = (state: State) => ({
  buildings: state.buildings,
  defaultBuilding: state.defaultBuilding,
});

const connector = connect(mapStateToProps);
interface Props extends ConnectedProps<typeof connector> {
  buildings: Building[],
  defaultBuilding: Building | undefined,
};

class MainContainer extends React.Component<Props> {
  createAlert(device: any, nameBuilding: any, index: number){
    Alert.alert(
      "Something went wrong !!!",
       device.name+" in building '" + nameBuilding +"' have problems." ,
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Alert"),
          style: "cancel"
        },
        { text: "", onPress:() => console.log("OK")}
      ]
    );
  }
  CheckPushNoti (list:any){
    if(list){
      for(let i=list.length-1; i>=0; i--){
        for(let k=0; k<list[i].devices.length; k++){
          if(list[i].devices[k].data.length){
            let value=splitDataValue(list[i].devices[k].data[list[i].devices[k].data.length-1]?.value);
            if(list[i].devices[k].deviceType == "gas"){       
              if(Number(value)==1){
                this.createAlert(list[i].devices[k], list[i].name, i);
              }
            }
            else if(list[i].devices[k].deviceType == "temperature"){
              if(Number(value)>60){
                this.createAlert(list[i].devices[k], list[i].name, i);
              }
            }
          }
        }  
      }
    }
    return;
  }
  render() {
    if(this.props.buildings){
      this.CheckPushNoti(this.props.buildings);
    }
    return (
      <NavigationContainer>
        <Navigator>
          <Screen name="Home" component={Home} options={{headerShown: false}} />
          <Screen name="Dashboard" component={Dashboard} options={{headerTransparent: true,headerTitle:"Dashboard", headerTintColor: 'white'}} />
          <Screen name="My Buildings" component={MyBuildingsContainer} options={{headerShown: false}} />
          <Screen name="RemoteControl" component={RemoteControl} options={{headerShown: false}} />
          <Screen name="OptionScreen" component={OptionScreen} options={{headerShown: false}} />
          <Screen name="RoomScreen" component={RoomScreen} options={{headerShown: false}} />
          <Screen name="NotificationHistory" component={NotificationHistory} options={{ title: "NOTIFICATION", headerTitleAlign: 'center', headerTitleStyle: { color: "#fff8dc" }, headerStyle: { backgroundColor: "#6495ed"} }}></Screen>
          <Screen name="NotificationDaily" component={NotificationDaily}options={{ title: "NOTIFICATION DAILY", headerTitleAlign: 'center', headerTitleStyle: { color: "#fff8dc" }, headerStyle: { backgroundColor: "#6495ed"} }}></Screen>
        </Navigator>
      </NavigationContainer>
    )
  }
};
export default connector(MainContainer);