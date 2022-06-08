import React from 'react';
import { StyleSheet, View, Text, Dimensions, Button, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect, ConnectedProps } from 'react-redux';
import { State } from '@/redux/state';
import { Building, Device, User, ProtectionMessage } from '@/models';
import deviceTopics from '@/utils/deviceTopics';
import pubMessages from '@/utils/pubMessage';
import {DeviceTopics} from '@/utils/pubMessage';
import { typeItem } from '@utils/output.devices';
import Modal from 'react-native-modal';
import Slider from '@react-native-community/slider';
import DataService from '@/services/data.service';
import ControlService from '@/services/control.service';
import actions, { Action } from '@/redux/actions';
import { DeviceType } from '@/models/devices';
const {height, width} = Dimensions.get('screen')

const mapStateToProps = (state: State) => ({
  currentUser: state.currentUser,
  defaultBuilding: state.defaultBuilding,
});

const mapDispatchToProps = {
  updateProtection: actions.updateProtection
};

const connector = connect(mapStateToProps, mapDispatchToProps);
interface Props extends ConnectedProps<typeof connector> {
  currentUser: User | null,
  defaultBuilding: Building | undefined,
  updateProtection: (payload: ProtectionMessage) => Action
  hasDevice: boolean,
  item: typeItem
};

interface ModalItemState {
  isModalVisible: boolean,
  valueSetting: number,
  valueDisplay: number,
  toggle: boolean,
  // onControl: boolean,
  icon: boolean
}

class ModalItem extends React.Component<Props, ModalItemState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isModalVisible: false,
      valueSetting: this.getInitialSetting(),
      valueDisplay: this.getInitialSetting(),
      toggle: false,
      icon: this.getActivation()
    };
  }

  getInitialSetting = () => {
    let item = this.props.defaultBuilding?.devices.find((item) => item.name === this.props.item.ID);
    if(item?.triggeredValue !== undefined){
      return parseInt(item?.triggeredValue);
    }
    return 0;
  }

  componentDidUpdate(prevProps: Props, prevState: ModalItemState){
    let getUpdateItem = this.props.defaultBuilding?.devices.find((item) => item.name === this.props.item.ID);
    if(getUpdateItem?.triggeredValue !== prevState.valueSetting.toString() && getUpdateItem?.triggeredValue !== undefined){
      this.setState({valueSetting: parseInt(getUpdateItem?.triggeredValue)});
    }
  }

  getActivation = () => {
    if(this.props.hasDevice){
      let device = this.props.defaultBuilding?.devices.find((item) => item.name === this.props.item.ID)
      let data = device?.data
      if(data !== undefined && data.length !== 0){
        let latestData = data[data.length-1]
        if(Number(latestData.value) !== 0){
          return true
        }
      }
    }
    return false
  }

  toggleModal(){
    this.setState({isModalVisible: !this.state.isModalVisible})
  }

  handleValue = (value: number) => {
    this.setState({valueSetting: Math.round(value)})
  }

  handleDisplay = (value: number) => {
    this.setState({valueDisplay: Math.round(value)})
  }

  updateData = () => {
    var data: number = -1;
    if(this.props.item.deviceType === 'sprinkler'){
      data = 1;
    }else if(this.props.item.deviceType === 'power'){
      data = 0;
    }
    else{
      data = this.state.valueSetting;
    }
    
    if(!this.props.defaultBuilding || data === null){
      this.setState({isModalVisible: !this.state.isModalVisible});
      return;
    } 
    var currentDevice = this.props.defaultBuilding.devices.find((item: Device) => 
      this.props.item.ID === item.name)
    if(currentDevice === undefined){
        Alert.alert(
          "ERROR",
          "Could not find the device",
          [{ text: "OK" }]
        );
    }else{
        DataService.updateDeviceProtection({
          deviceName: currentDevice.name,
          protection: currentDevice.protection,
          triggeredValue: data.toString()
        }).then(response => {
        if (response === null) {
          Alert.alert(
            "Update device value failed",
            "Unknown error from server. Please try again!",
            [{ text: "OK" }]
          );
        } else {
          let msg: ProtectionMessage = {
            _name: response.name, 
            protection: response.protection, 
            triggeredValue: response.triggeredValue
          };
          this.props.updateProtection(msg);
        }
        }).catch(err => console.error(err));
    }
    this.setState({isModalVisible: !this.state.isModalVisible});
  }

  gasDectection = (data: { time: Date, value: string }[]) => {
    if(data.length === 0)
      return false;
    if(data.length !== 0 || data !== null){
      let gasData = Number(data[data.length-1].value);
      if(gasData === 1){
        return true;
      }
    }
    return false;
  } 

  onDanger = () => {
    let gasDevice = this.props.defaultBuilding?.devices.filter((item) => (item.deviceType === 'gas'))
    let gasDectection;
    if(gasDevice){
      gasDevice.map((item) => {
        let data = this.gasDectection(item.data);
        data === true? gasDectection = true : gasDectection = false;
      })
    }
    return gasDectection
  }

  pressIcon = () => {
    let value:any = !this.state.icon
    let topic = deviceTopics[this.props.item.deviceType as DeviceType]
    let msg = pubMessages[topic as DeviceTopics]
    let data;
    if(this.props.item.deviceType === 'sprinkler' || this.props.item.deviceType === 'power'){
      data = Number(value)
    }else{
      data = this.state.valueSetting
    }

    if(value){
      msg = {
        ...msg,
        name: this.props.item.ID,
        data: data.toString(),
      }
    }else{
      msg = {
        ...msg,
        name: this.props.item.ID,
        data: "0"
      }
    }
    ControlService.pub(topic, msg)
    this.setState({icon: !this.state.icon})
  }

  render(){
    return(
        <TouchableOpacity onPress={this.props.hasDevice? () => this.toggleModal() : () => {}}>
            <View style={[styles.itemContainer, { backgroundColor: '#fff', alignItems: 'center' }]}>
            <Icon 
              name={this.props.item.icon} 
              size={55}
              onPress={!this.props.hasDevice || (this.props.item.deviceType == 'power' && this.onDanger())? 
                () => {} : 
                () => this.pressIcon()}
              style={this.state.icon? {color: '#1EC639'} : {color: '#000000'}}
            />
            <Text style={[styles.itemName, {fontSize: 30, textAlign: 'center', }]}>{this.props.item.name}</Text>
            <Text style={[styles.itemName, {fontSize: 20, textAlign: 'center', fontWeight: '400', fontStyle: 'italic', marginTop: 2}]}>
              {!this.props.hasDevice? 'No devices' : this.props.item.ID}
            </Text>
            <Modal 
              isVisible={this.state.isModalVisible}
              swipeDirection={'down'}
              backdropColor={'#708090'}
              backdropOpacity={0.8}
              useNativeDriver={true} 
            >
              <View style={{backgroundColor: '#FFFFFF', height: 200}}>
              <View style={styles.content}>
              <Text style={[styles.contentTitle, {fontWeight: 'bold', fontSize: 23}]}>{this.props.item.setting} setting</Text>
              {this.props.item.deviceType === 'sprinkler' || this.props.item.deviceType === 'power'?
                  <View style={{width: width/2, alignItems: 'center'}}>
                    <Text 
                      style={{
                        fontSize: 20, 
                        textAlign: 'center', 
                        fontWeight: '400', 
                        fontStyle: 'italic', 
                        fontFamily: 'Roboto',
                        width: width/2}}
                    >
                      Sorry, this devices currently has no setting options !
                    </Text>           
                  </View>
                  :
                  <View>
                    <Text style={styles.contentTitle} numberOfLines={2}>
                        Adjust value from {this.props.item.deviceType === 'fan'? -255 : 0} to {this.props.item.maxSetting}{"\n"} 
                        Current value is {Math.round(this.state.valueDisplay) } 
                    </Text>
                    <Slider
                        style={{width: 200, height: 40, marginHorizontal: 30, transform: [{scaleY: 1.5}]}}
                        minimumValue={this.props.item.deviceType === 'fan'? -255 : 0}
                        maximumValue={this.props.item.maxSetting}
                        minimumTrackTintColor="#000000"
                        maximumTrackTintColor="#000000"
                        onSlidingComplete={value => this.handleValue(value)}
                        onValueChange={value => this.handleDisplay(value)}
                        value={this.state.valueSetting}
                    />
                  </View>
                }

                <View style={{marginTop: 20, zIndex: -10}}>
                    <Button 
                      onPress={() => this.updateData()} 
                      title="Close"/>
                </View>
                </View>
            </View>
            </Modal>    
            </View>
        </TouchableOpacity>                                        
    )  
  }
}

export default connector(ModalItem);

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
  onOff: {
    alignItems: 'center',
    transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],
    width: 50,
    marginTop: 3,
  }
});