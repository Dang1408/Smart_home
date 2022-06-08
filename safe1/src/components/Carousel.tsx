import React, { PureComponent } from 'react';
import { View } from 'react-native'
import Carousel, { Pagination } from 'react-native-snap-carousel';
import SliderEntry from '@/components/SliderEntry';
import { sliderWidth, itemWidth } from '@/styles/sliderEntry';
import styles, { colors } from '@/styles/carousel';
import {DEFAULT, REGION, data} from '@/utils/default.data';
import { connect, ConnectedProps } from 'react-redux';
import { State } from '@/redux/state';
import { Building, Device, User } from '@/models';
import actions, { Action } from '@/redux/actions';

const SLIDER_FIRST_ITEM = 0;

const mapStateToProps = (state: State) => ({
  currentUser: state.currentUser,
  defaultBuilding: state.defaultBuilding,
});

const mapDispatchToProps = {
  setDefaultBuilding: actions.setDefaultBuilding,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

interface Props extends ConnectedProps<typeof connector> {
  currentUser: User | null,
  defaultBuilding: Building | undefined,
  setDefaultBuilding: (payload?: Building) => Action,
};

interface IMyComponentState {
  slider1ActiveSlide: number,
  roomData: data[]
}

type input = {
  item: data,
  index: number
}
class RoomDevicesCarousel extends PureComponent<Props, IMyComponentState> {
  private _slider1Ref: React.RefObject<HTMLInputElement>;
  constructor (props: any) {
    super(props);
    this.state = {
      slider1ActiveSlide: SLIDER_FIRST_ITEM,
      roomData: DEFAULT
    };
    this._slider1Ref = React.createRef();
  }

  componentDidMount(){
    if(this.props.defaultBuilding === undefined) return;
    let ROOM_DATA = DEFAULT.map((elem) => ({...elem}));
    let ROOM_REGION = REGION.map((elem) => (elem));
    var devices = this.props.defaultBuilding.devices;

    devices.forEach((device: Device) => {
      let deviceRegion = device.region.trim().toLowerCase();
      if(!(REGION.includes(deviceRegion))){
        let room = DEFAULT.find((item) => 
         deviceRegion.includes(item.title.trim().toLowerCase()) === true
        )
        ROOM_REGION.push(deviceRegion);
        let name = deviceRegion.charAt(0).toUpperCase() + deviceRegion.slice(1);
        if(room !== undefined){      
          let new_room: data = {
            title: name, 
            num: room.num, 
            illustration: room.illustration
          }
          ROOM_DATA.push(new_room);
        }else{
          let new_room: data = {
            title: name,
            num: '0',
            illustration: require('@/assets/rooms/default.jpg')
          }
          ROOM_DATA.push(new_room);
        }
      }
    })

    devices.forEach((device: Device) => {
      let region = device.region.trim().toLowerCase();
      if(ROOM_REGION.includes(region)){
        let idx: number, value: number;
        idx = ROOM_DATA.findIndex((item) => item.title.trim().toLowerCase() === region);
        value = parseInt(ROOM_DATA[idx].num) + 1;
        ROOM_DATA[idx].num = value.toString();
      }
    })

    if(devices.length >= 1){
      ROOM_DATA = ROOM_DATA.filter((room) => 
        room.num !== "0"
      )
    }
    module.exports = ROOM_DATA;
    this.setState({roomData: ROOM_DATA})
  }

  _renderItemWithParallax = ({item, index}: input, parallaxProps: Object) => {
    return (
      <SliderEntry
        data={item}
        even={(index + 1) % 2 === 0}
        parallax={true}
        parallaxProps={parallaxProps}
      />
    );
  }

  main () {
    return (
      <View style={this.state.roomData.length === 1? 
        [styles.exampleContainer, {marginTop: 10}] 
        : styles.exampleContainer}
      >
        <Carousel
          ref={() => {this._slider1Ref}}
          data={this.state.roomData}
          renderItem={this._renderItemWithParallax}
          sliderWidth={sliderWidth}
          itemWidth={itemWidth}
          hasParallaxImages={true}
          firstItem={SLIDER_FIRST_ITEM}
          inactiveSlideScale={0.94}
          inactiveSlideOpacity={0.7}
          containerCustomStyle={styles.slider}
          contentContainerCustomStyle={styles.sliderContentContainer}
          loop={true}
          onSnapToItem={(index) => this.setState({ slider1ActiveSlide: index }) }
        />
        <Pagination
          dotsLength={this.state.roomData.length}
          activeDotIndex={this.state.slider1ActiveSlide}
          containerStyle={styles.paginationContainer}
          dotColor={'#434FEA'}
          dotStyle={styles.paginationDot}
          inactiveDotColor={colors.dot}
          inactiveDotOpacity={0.4}
          inactiveDotScale={0.6}
        />
      </View>
    );
  }


  render () {
    const example = this.main();

    return (
        <View style={styles.entire}>                    
          { example }  
        </View>
    );
  }
}

export default connector(RoomDevicesCarousel)
