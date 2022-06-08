import React from 'react'
import {View, Text, TouchableOpacity, StyleSheet, Dimensions} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import RoomCarousel from '@/components/RoomCarousel'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

const {height, width} = Dimensions.get('screen')

interface Props {
  navigation: any
}

class RemoteControl extends React.Component<Props>{
  render(){
    const { navigate } = this.props.navigation;
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
                navigate('RemoteControl');
                }}
            >
                <Icon name = {'keyboard-backspace'} color = {'#fff'} size = {40}/>
            </TouchableOpacity>

            <View style = {styles.roomDevices}>
              <Text style = {styles.primaryText}>Devices</Text>
              <RoomCarousel/>
            </View>
            
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
    left: width/20,
    top: height/25,
    zIndex: 999
  },
  roomDevices: {
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
})