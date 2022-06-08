import React, { PureComponent } from 'react';
import { View } from 'react-native'
import Carousel from 'react-native-snap-carousel';
import RoomSliderEntry from '@/components/RoomSliderEntry';
import { sliderHeight, itemHeight, itemWidth } from '@/styles/roomSliderEntry';
import styles from '@/styles/roomCarousel';
import {DEFAULT, data} from '@/utils/default.data';
import { connect, ConnectedProps } from 'react-redux';
import { State } from '@/redux/state';
import { Building, User } from '@/models';
import { Dimensions } from 'react-native';
const { width, height} = Dimensions.get('window');

const SLIDER_FIRST_ITEM = 0;
const ROOM_DATA = require('@/components/Carousel');

const mapStateToProps = (state: State) => ({
  currentUser: state.currentUser,
  defaultBuilding: state.defaultBuilding,
});

const connector = connect(mapStateToProps);

interface Props extends ConnectedProps<typeof connector> {
  currentUser: User | null,
  defaultBuilding: Building | undefined,
};

interface IMyComponentState {
  slider1ActiveSlide: number,
  roomData: data[]
}

type input = {
  item: data,
  index: number
}

class RoomCarousel extends PureComponent<Props, IMyComponentState> {
  private _slider1Ref: React.RefObject<HTMLInputElement>;
  constructor (props: Props) {
    super(props);
    this.state = {
      slider1ActiveSlide: SLIDER_FIRST_ITEM,
      roomData: DEFAULT
    };
    this._slider1Ref = React.createRef();
  }

  componentDidMount(){
    if(ROOM_DATA.default || (this.props.defaultBuilding === undefined)) return
    this.setState({roomData: ROOM_DATA})
  }

  _renderItemWithParallax = ({item, index}: input, parallaxProps: Object) => {
    return (
      <RoomSliderEntry
        data={item}
        even={(index + 1) % 2 === 0}
        parallax={true}
        parallaxProps={parallaxProps}
      />
    );
  }

  render () {
    return (
      <View style={styles.exampleContainer}>
        <Carousel
            ref={() => {this._slider1Ref}}
            data={this.state.roomData}
            renderItem={this._renderItemWithParallax}
            sliderHeight={sliderHeight}
            itemHeight={itemHeight}
            itemWidth={itemWidth}
            hasParallaxImages={true}
            firstItem={SLIDER_FIRST_ITEM}
            inactiveSlideScale={0.90}
            inactiveSlideOpacity={0.8}
            containerCustomStyle={this.state.roomData.length === 1? 
                                  [styles.slider, {bottom: height/8}] : styles.slider}
            contentContainerCustomStyle={styles.sliderContentContainer}
            vertical={true}
            loop={true}
            enableMomentum={true}
            onSnapToItem={(index) => this.setState({ slider1ActiveSlide: index }) }
        />
      </View>
    );
  }
}

export default connector(RoomCarousel);