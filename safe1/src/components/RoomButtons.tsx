import React, { Component } from 'react';
import { View, Text } from 'react-native'
import { REGION } from '@/utils/default.data';
import ScrollingButtonMenu from '@/components/ScrollButton';
import { connect, ConnectedProps } from 'react-redux';
import { State } from '@/redux/state';
import { Building, Device, User } from '@/models';
import List from '@/components/SectionGrid';
import { data } from '@/utils/default.data';

const ROOM_DATA = require('@/components/Carousel');
const mapStateToProps = (state: State) => ({
  currentUser: state.currentUser,
  defaultBuilding: state.defaultBuilding,
});

const connector = connect(mapStateToProps);

type rooms = {
  id: number, 
  name: string
} 
let availableRegion:  rooms[]
availableRegion = REGION.map((elem) => ({id: REGION.indexOf(elem), name: elem.charAt(0).toUpperCase() + elem.slice(1)}))
interface Props extends ConnectedProps<typeof connector> {
  currentUser: User | null,
  defaultBuilding: Building | undefined,
};


interface ButtonsState {
  regionState: any,
  selectedIndex: number
}
class roomButtons extends Component<Props, ButtonsState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      regionState: availableRegion,
      selectedIndex: 0
    }
    this.handler = this.handler.bind(this)
  }

  componentDidMount(){
    if(ROOM_DATA.default || (this.props.defaultBuilding === undefined)) return;
    var AVAILABLE_ROOM = ROOM_DATA.map((item: data, index: number) => ({id: index, name: item.title}))
    this.setState({regionState: AVAILABLE_ROOM});
  }

  handler(id: number){
    this.setState({selectedIndex: id});
  } 

  render () {
    return (
      <View>
        <ScrollingButtonMenu 
          items={this.state.regionState}
          selected={this.state.regionState[0].id}
          callbackId={this.handler}
        />
        <List 
          selectedRoom={this.state.regionState[this.state.selectedIndex].name}
        />
        
      </View>
    );
  }
}

export default connector(roomButtons)