import React from 'react';
import { View, StyleSheet  } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ProgressCircle from '@/components/Circle'

interface Props {
  temp: number
}

export default function ThermoMonitor({temp}: Props) {
  return (
    <View style={styles.thermoMonitor}>
      <ProgressCircle
        percent={temp}
        radius={90}
        borderWidth={30}
        color="#FA582F"
        shadowColor="#C1C1C1"
        bgColor="#fff"
      >
          <Icon 
            name = {'thermometer-lines'}
            size = {50}
            color = {'#F84018'}
          />
      </ProgressCircle>
    </View>
  
  );
}

const styles = StyleSheet.create({
  thermoMonitor: {
    alignContent: 'center',
    marginTop: 20,
    alignItems: 'center'
  } 
})