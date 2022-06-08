import React from 'react'
import {View, Text, TouchableOpacity, StyleSheet, Dimensions} from 'react-native'
import { AvatarControl } from '@/components'
import { ScrollView } from 'react-native-gesture-handler'
import LinearGradient from 'react-native-linear-gradient'
import { SafeAreaView } from 'react-native-safe-area-context'
import RoomDevicesCarousel from '@/components/Carousel'
import RoomButtons from '@/components/RoomButtons'
import AvatarPile from '@/components/AvatarPile'
import Feather from 'react-native-vector-icons/Feather'

const {height, width} = Dimensions.get('screen')

interface Props {
  navigation: any
}
interface State {
  screenHeight: number
};
class RemoteControl extends React.Component<Props, State>{
  constructor(props: Props) {
    super(props);
    this.state = {
      screenHeight: 0
    };
  }

  onContentSizeChange = (contentWidth: number, contentHeight: number) => {
    this.setState({screenHeight: contentHeight})
  }

  render(){
    const { navigate } = this.props.navigation;
    const scrollEnabled = this.state.screenHeight > height;
    return (
      <LinearGradient 
        colors = {['#4F9FFF', '#002150']} 
        style = {styles.container}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 0.5}}
      >
        <SafeAreaView style={{flex: 1}}>
        <ScrollView
          scrollEnabled = {scrollEnabled}
          onContentSizeChange = {this.onContentSizeChange}
          contentContainerStyle={{flexGrow: 1}}
        >
          <TouchableOpacity
            style = {styles.outButton}
            onPress = {() => {
              navigate('Home');
            }}
          >
            <Feather name = "x" color = 'white' size = {40}/>
          </TouchableOpacity>
          <AvatarControl size="xlarge"/>
          
          <View style = {styles.roomDevices1}>
            <Text style = {styles.primaryText}>Rooms</Text>
            <View style = {styles.allToggle}>
              <Text 
                style = {styles.secondaryText} 
                onPress = {() => navigate('RoomScreen')}
              >
                All
              </Text>
            </View>
            
          </View>
          <RoomDevicesCarousel/>

          <View style = {styles.roomDevices2}>
            <Text style = {styles.primaryText}>Devices</Text>
          </View>
          <View style = {styles.roomButtons}>
            <RoomButtons/>
          </View>
         
          <View style = {styles.residents}>
            <Text style = {styles.primaryText}>Residents</Text>
          </View>
          <View style = {styles.avatarPile}>
            <AvatarPile/>
          </View>
        </ScrollView>
      </SafeAreaView>
      </LinearGradient>  
    )
  }
}

export default RemoteControl;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  outButton: {
    position: 'absolute',
    left: width/1.2,
    top: 30,
    zIndex: 999
  },

  avatarText: {
    position: 'absolute',
    height: 50,
    left: width/3.5,
    top: height/18,
  },

  primaryText: {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 24,
    lineHeight: 28,
    letterSpacing: -0.24,
    width: width/2,
    color: '#FFFFFF',
  },
  secondaryText: {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: -0.24,

    color: '#FFFFFF',
  }, 
  roomDevices1: {
    position: 'absolute',
    width: 84,
    height: height/3,
    left: 24,
    top: height/6.5,
  },
  roomDevices2: {
    position: 'absolute',
    width: 84,
    height: height/3,
    left: 24,
    top: height/1.95,
  },
  allToggle:{
    position: 'absolute',
    left: width/1.25,
  },
  roomButtons:{
    top: height/8.5,
  },
  residents: {
    position: 'absolute',
    width: 150,
    height: height/3,
    left: 24,
    top: height/1.285,
  },
  avatarPile: {
    position: 'absolute',
    top: height/1.22,
    left: 24,
  }
})