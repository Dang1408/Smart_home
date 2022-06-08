import React from 'react';
import {View} from 'react-native';

import {Styles} from '@/styles/sectionGrid';
import ListItem from '@/components/ListItem';
import { DEFAULT_ITEMLIST, ITEMLIST, DEFAULT_PROTECTION } from '@/utils/itemList';
import { connect, ConnectedProps } from 'react-redux';
import { State } from '@/redux/state';
import { Building, Device, User } from '@/models';

var PROTECTION = {...DEFAULT_PROTECTION};

const mapStateToProps = (state: State) => ({
  currentUser: state.currentUser,
  defaultBuilding: state.defaultBuilding,
});

const connector = connect(mapStateToProps);
interface Props extends ConnectedProps<typeof connector> {
  currentUser: User | null,
  defaultBuilding: Building | undefined,
  selectedRoom: string
};

type ItemListType = {
  id: number;
  name: string;
  icon: string;
  color: string;
  status: string;
  subcolor?: string;
}
interface ListState {
  ItemList: ItemListType[],
  Protection: ItemListType
} 

class List extends React.Component<Props, ListState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      ItemList: DEFAULT_ITEMLIST,
      Protection: PROTECTION
    };
  }

  componentDidMount(){
    if(this.props.defaultBuilding === undefined || this.props.defaultBuilding.devices.length === 0){
      PROTECTION.status = "Off";
      this.setState({Protection: PROTECTION})
      return;
    }
    let devices = this.props.defaultBuilding.devices;
    let roomName: string = this.props.selectedRoom;
    
    let hasDevice: boolean = devices.some(function(value: Device){
      return value.region.toLowerCase() === roomName.toLowerCase()
    });
    if(hasDevice){
      let outputDevices = devices.filter((device: Device) =>  
        device.region.toLowerCase() === roomName.toLowerCase() && 
        device.deviceType !== 'temperature' && 
        device.deviceType !== 'gas'
      )
      let protection = outputDevices.some((item) => item.protection === true);
      let OnProtect;
      protection? OnProtect = 'On' : OnProtect = 'Off';
      PROTECTION.status = OnProtect;
      this.setState({Protection: PROTECTION})
    }
  }
  
  componentDidUpdate( prevProps: Props, prevState: ListState){
    const Celcius = '\u00b0\C';
    const Percent = '%'
    if(this.props.defaultBuilding === undefined) return;
    let devices = this.props.defaultBuilding.devices;
    let roomName: string = this.props.selectedRoom;
    
    let hasDevice: boolean = devices.some(function(value: Device){
      return value.region.toLowerCase() === roomName.toLowerCase()
    });
    if(hasDevice){
      let tempData = new Array();
      tempData = devices.filter((device: Device) =>  
        device.region.toLowerCase() === roomName.toLowerCase() && device.deviceType === 'temperature'
      )
      let outputDevices = devices.filter((device: Device) =>  
        device.region.toLowerCase() === roomName.toLowerCase() && 
        device.deviceType !== 'temperature' && 
        device.deviceType !== 'gas'
      )
      let protection = outputDevices.some((item) => item.protection === true);
      let OnProtect;
      protection? OnProtect = 'On' : OnProtect = 'Off';
      if( OnProtect !== prevState.Protection.status){
        PROTECTION.status = OnProtect;
        this.setState({Protection: PROTECTION})
      }
      if(tempData.length >= 1){
        let lastedData = tempData[0].data[tempData[0].data.length-1];
        if(!lastedData && (prevState.ItemList[0].status !== DEFAULT_ITEMLIST[0].status)){
          this.setState({ItemList: DEFAULT_ITEMLIST});
        }
        
        if(lastedData && lastedData.value){
          let temp: string = lastedData.value.split('-')[0] + Celcius;
          let humid: string = lastedData.value.split('-')[1] + Percent;
          if( temp !== prevState.ItemList[0].status || humid !== prevState.ItemList[1].status){
            ITEMLIST[0].status = temp;
            ITEMLIST[1].status = humid;
            this.setState({ItemList: ITEMLIST});
          }        
        }
        // maybe unnecessary
        if(lastedData && lastedData.data){
          let temp: string = lastedData.data.split('-')[0] + Celcius;
          let humid: string = lastedData.data.split('-')[1] + Percent;
          if( temp !== prevState.ItemList[0].status || humid !== prevState.ItemList[1].status){
            ITEMLIST[0].status = temp;
            ITEMLIST[1].status = humid;
            this.setState({ItemList: ITEMLIST});
          }  
        }
      }
      if(tempData.length === 0 && (prevState.ItemList[0].status !== DEFAULT_ITEMLIST[0].status)){
        this.setState({ItemList: DEFAULT_ITEMLIST});
      }
    }
  }

  render() {
    return (
      <View style={Styles.container}>
        <View style={{display: 'flex', flexDirection: 'row'}}>
          <ListItem
            styles={{marginRight: 10}}
            item={this.state.Protection}
          />
          <ListItem
            styles={{}}
            item={this.state.ItemList[0]}
          />
          <ListItem
            styles={{marginLeft: 10}}
            item={this.state.ItemList[1]}
          />
        </View>
      </View>
    );
  }
}

export default connector(List)