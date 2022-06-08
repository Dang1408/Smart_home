import React, {useState} from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import OptionButtons from '@/components/OptionButtons';
import ProtectionGrid from '@/components/ProctectionGrid';
import ThermoMonitor from '@/components/ThermoMonitor';
import HumidityMonitor from '@/components/HumidityMonitor';
import { useNavigation } from '@react-navigation/native';
import { connect, ConnectedProps } from 'react-redux';
import { State } from '@/redux/state';
import { Building, Device, User } from '@/models';

const {height, width} = Dimensions.get('screen')

const Protection = (props: any) => {
  const [numRooms, setNumRooms] = useState(0);
  return (
    <View style={styles.body}>
      <Text style={bodyStyles.intro} numberOfLines={2}>
        {numRooms} protection options in the kitchen are 
        <Text style={{fontWeight: 'bold', color: '#1EC639'}}> available </Text> 
      </Text>
      <ProtectionGrid selectedRoom={props.room} setNum={setNumRooms}/>
    </View>
  );
}

const Setting = (props: any) => {
  return (
    <View style={styles.body}>
      <Text style={[bodyStyles.intro, {textAlign: 'center'}]} numberOfLines={2}>
        Click icon to activate{"\n"}
        Touch to change the setting
      </Text>
      <ProtectionGrid selectedRoom={props.room} isSetting={true}/>
    </View>
  );
}


const Monitor = (props: any) => { 
  const celcius = '\u00b0\C'; 
  return (
    <View style={styles.body}>
      <Text style={[bodyStyles.intro, bodyStyles.introThermo]}>
        Now, Temperature is
        {isNaN(props.temp) ? 
          <Text style={{fontWeight: 'bold', color: '#FA582F'}}> {props.temp}</Text> :
          <Text style={{fontWeight: 'bold', color: '#FA582F'}}> {props.temp}{celcius}</Text>
        }
      </Text>
      <ThermoMonitor temp={props.temp}/>
      <Text style={[bodyStyles.intro, bodyStyles.introThermo]}>
        And Humidity is
        {isNaN(props.humid) ? 
          <Text style={{fontWeight: 'bold', color: '#3B2BFF'}}> {props.humid}</Text> :
          <Text style={{fontWeight: 'bold', color: '#3B2BFF'}}> {props.humid}%</Text>
        }
      </Text>
      <HumidityMonitor humid={props.humid}/>
      <AppButton/>
    </View>
  );
}

const mapStateToProps = (state: State) => ({
  currentUser: state.currentUser,
  defaultBuilding: state.defaultBuilding,
});

const connector = connect(mapStateToProps);
interface Props extends ConnectedProps<typeof connector> {
  currentUser: User | null,
  defaultBuilding: Building | undefined,
  navigation: any,
  route: any  
};

interface OptionState {
  selectedId: number,
  tempData: {temp:number, humid: number}
}  

const tempData = {
  temp: NaN,
  humid: NaN
}
class OptionScreen extends React.Component<Props, OptionState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      selectedId: 0,
      tempData: tempData
    };
  }

  componentDidUpdate( prevProps: Props, prevState: OptionState){
    if(!this.props.defaultBuilding) return;
    var devices = this.props.defaultBuilding.devices;
    var roomName: string = this.props.route.params.title;
    var hasDevice: boolean = devices.some(function(value: Device){
      return value.region.toLowerCase() === roomName.toLowerCase()
    });
    if(hasDevice){
      var tempData = new Array();
      tempData = devices.filter((device: Device) =>  
        device.region.toLowerCase() === roomName.toLowerCase() && device.deviceType === 'temperature'
      )
      if(tempData.length >= 1){
        var lastedData = tempData[0].data[tempData[0].data.length-1];
        if(lastedData && lastedData.value){
          var temp: number = parseInt(lastedData.value.split('-')[0]);
          var humid: number = parseInt(lastedData.value.split('-')[1]);
          if(temp !== prevState.tempData.temp || humid !== prevState.tempData.humid){
            this.setState({tempData: {temp, humid}});
          }        
        }
        // maybe unnecessary
        if(lastedData && lastedData.data){
          var temp: number = parseInt(lastedData.data.split('-')[0]);
          var humid: number = parseInt(lastedData.data.split('-')[1]);
          if(temp !== prevState.tempData.temp || humid !== prevState.tempData.humid){
            this.setState({tempData: {temp, humid}});
          } 
        }
      }
    }
  }

  changeSelectedID = (newValue: number) => {
    this.setState({
      selectedId: newValue,
    });
  }

  render() {
    return (
      <LinearGradient 
        colors = {['#4F9FFF', '#002150']} 
        style = {styles.container}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 0.5}}
      >
        
        <TouchableOpacity
          style = {styles.outButton}
          onPress = {() => {
          this.props.navigation.goBack();
          }}
        >
          <Icon name = {'keyboard-backspace'} color = {'#fff'} size = {40}/>
        </TouchableOpacity>

        <View style = {styles.roomDevices}>
          <Text style = {styles.primaryText}>{this.props.route.params.title}</Text>
        </View>
        <View style = {styles.optionButtons}>
          <OptionButtons changeSelectedID={this.changeSelectedID.bind(this)}/>
        </View>
        
        {this.state.selectedId === 0? <Protection room={this.props.route.params.title}/> : null}
        {this.state.selectedId === 1? <Monitor temp={this.state.tempData.temp} humid={this.state.tempData.humid}/> : null}
        {this.state.selectedId === 2? <Setting room={this.props.route.params.title}/> : null}
      </LinearGradient>  
    )
  }
}

const AppButton = () => {
  const navigation = useNavigation();
  return (
  <View style={{alignItems: 'center'}}>
    <TouchableOpacity
      onPress={() => {navigation.navigate('Dashboard');}}
      style={[
        {
          paddingHorizontal: 8,
          paddingVertical: 6,
          marginTop: 30,
          height: 50,
          elevation: 6,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          borderBottomLeftRadius: 30,
          borderBottomRightRadius: 30,
          width: 150,
        } ,
        { backgroundColor: '#434FEA' }
      ]}
    >
      <Text style={{ fontSize: 24, fontFamily: 'Roboto', textAlign: 'center', color: '#fff' }}>
        More
      </Text>
    </TouchableOpacity>
  </View>
  )
}

export default connector(OptionScreen);

const styles = StyleSheet.create({
  container:{
    flex: 1
  },
  body: {
    flex: 1,
    backgroundColor: "white",
    position: 'relative',
    top: height/17,
    bottom: height/18,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  outButton: {
    position: 'relative',
    left: width/20,
    top: height/25,
    zIndex: 999,
  },
  roomDevices: {
    position: 'absolute',
    width: width/1,
    top: height/25,
    marginTop: 10,
    left: width/10,
  },
  primaryText: {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 30,
    lineHeight: 30,
    letterSpacing: -0.24,
    color: '#FFFFFF',
    right: width/10,
    textAlign: 'center'
  },
  optionButtons:{
    top: height/22.5,
  },
})

const bodyStyles = StyleSheet.create({
  intro: {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: '500',
    marginTop: 20,
    marginHorizontal: 20,
    fontSize: 30,
    lineHeight: 40,
    textAlign: 'left'
  },
  introThermo: {
    textAlign: 'center'
  }
})