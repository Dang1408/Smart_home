import React from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { FlatGrid } from 'react-native-super-grid';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect, ConnectedProps } from 'react-redux';
import { State } from '@/redux/state';
import { Building, Device, User } from '@/models';
import { OUTPUT_DEVICES, typeItem } from '@/utils/output.devices';
import OnProtection  from '@/components/OnProtectionButton';
import ModalItem from '@/components/Modal'

const {height, width} = Dimensions.get('screen')


const mapStateToProps = (state: State) => ({
  currentUser: state.currentUser,
  defaultBuilding: state.defaultBuilding,
});

const connector = connect(mapStateToProps);
interface Props extends ConnectedProps<typeof connector> {
  currentUser: User | null,
  defaultBuilding: Building | undefined,
  selectedRoom: string,
  setNum?: any,
  isSetting?: boolean,
};

interface ProtectionGridState {
  currentRoom: string,
  settingAvailableDevice: typeItem[],
  protectionAvailableDevice: typeItem[],
  hasDevice: boolean,
  takeDefaultData: boolean,
  isModalVisible: boolean,
  relaySetting: number,
  valueSetting: number
}

class ProtectionGrid extends React.Component<Props, ProtectionGridState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      currentRoom: '',
      settingAvailableDevice: this.getSettingAvailableDevice(),
      protectionAvailableDevice: OUTPUT_DEVICES,
      hasDevice: this.checkDevices(),
      takeDefaultData: false,
      isModalVisible: false,
      relaySetting: 1,
      valueSetting: 0
    };
  }

  checkDevices = () => {
    let roomName: string = this.props.selectedRoom;
    let outputDevices = this.props.defaultBuilding?.devices.filter((device: Device) =>  
      device.region.toLowerCase() === roomName.toLowerCase() && 
      device.deviceType !== 'temperature' && 
      device.deviceType !== 'gas'
    )
    if(outputDevices !== undefined){
      return outputDevices.length > 0
    }
    return false
  }
  
  getSettingAvailableDevice = () => {
    if(!this.props.defaultBuilding) return OUTPUT_DEVICES;
    var devices = this.props.defaultBuilding.devices;
    var roomName: string = this.props.selectedRoom;
    var hasDevice: boolean = devices.some(function(value: Device){
      return value.region.toLowerCase() === roomName.toLowerCase()
    });
    if(hasDevice){
      var outputDevices = devices.filter((device: Device) =>  
        device.region.toLowerCase() === roomName.toLowerCase() && 
        device.deviceType !== 'temperature' && 
        device.deviceType !== 'gas'
      )
      var AVAILABLE_DEVICES = OUTPUT_DEVICES.filter((item: typeItem) => 
        outputDevices.find((data: Device) => (data.deviceType === item.deviceType)));
      var DATA = [];
      for(let i = 0; i < outputDevices.length; i++){
        let item = AVAILABLE_DEVICES.find((item) => item.deviceType === outputDevices[i].deviceType);
        if(item !== undefined){
          let ele = {...item, ID: outputDevices[i].name};
          DATA.push(ele);
        }
      }
      return DATA
    }
    return OUTPUT_DEVICES
  }

  componentDidMount(){
    if(!this.props.defaultBuilding) return;
    var devices = this.props.defaultBuilding.devices;
    var roomName: string = this.props.selectedRoom;
    var hasDevice: boolean = devices.some(function(value: Device){
      return value.region.toLowerCase() === roomName.toLowerCase()
    });
    if(hasDevice){
      var outputDevices = new Array();
      outputDevices = devices.filter((device: Device) =>  
        device.region.toLowerCase() === roomName.toLowerCase() && 
        device.deviceType !== 'temperature' && 
        device.deviceType !== 'gas'
      )
      var AVAILABLE_DEVICES = OUTPUT_DEVICES.filter((item: typeItem) => 
        outputDevices.find((data: Device) => (data.deviceType === item.deviceType)));

      this.setState({protectionAvailableDevice: AVAILABLE_DEVICES});    
      if(this.props.setNum !== undefined){
        this.props.setNum(AVAILABLE_DEVICES.length)
      } 
    }
  }

  toggleModal(){
    this.setState({isModalVisible: !this.state.isModalVisible})
  }

  handleSetting = (value: number) => {
    console.log(value)
    if(typeof(value) === 'number') 
      this.setState({relaySetting: value})
  }

  handleValue = (value: number) => {
    console.log(value)
    this.setState({valueSetting: value})
  }

  render(){
    return (
      this.props.isSetting? 
        <FlatGrid
          itemDimension={width/3}
          data={this.state.settingAvailableDevice.length > 0? this.state.settingAvailableDevice : OUTPUT_DEVICES}
          style={styles.gridView}
          spacing={20}
          renderItem={({ item }) => (
            <ModalItem item={item} hasDevice={this.state.hasDevice}/>
          )}
        />
        :
        <FlatGrid
          itemDimension={width/3}
          data={this.state.protectionAvailableDevice.length > 0? this.state.protectionAvailableDevice : OUTPUT_DEVICES}
          style={styles.gridView}
          spacing={20}
          renderItem={({ item }) => (
            <View style={[styles.itemContainer, { backgroundColor: '#fff' }]}>
              <Icon name={item.icon} size={50}/>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
              <OnProtection 
                isAvailable={this.state.protectionAvailableDevice}
                item={item}
                hasDevice={this.state.hasDevice}
                currentRoom={this.props.selectedRoom}
              />
            </View>
          )}
        />
    );
  }
}

export default connector(ProtectionGrid);

const styles = StyleSheet.create({
  gridView: {
    flex: 1,
  },
  itemContainer: {
    justifyContent: 'flex-start',
    borderRadius: 5,
    padding: 10,
    height: 150,
    borderColor: '#000',
    borderWidth: 2,
    shadowColor: '#fff',
    shadowOffset: {
        width: 0,
        height: 8,
    },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  itemName: {
    fontSize: 20,
    fontFamily:'Roboto',
    color: '#000',
    fontWeight: '700',
  },
  itemSubtitle: {
    fontWeight: '700',
    fontSize: 16,
    color: '#000',
  },
  onOff: {
    alignItems: 'flex-start',
    transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],
    width: 50,
    marginTop: 3,
  },
  content: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  contentTitle: {
    fontFamily:'Roboto',
    fontSize: 20,
    marginBottom: 12,
    textAlign: 'center'
  },
});