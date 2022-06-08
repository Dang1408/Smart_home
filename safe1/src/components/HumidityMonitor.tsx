import React from 'react';
import { View, StyleSheet  } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ProgressCircle from '@/components/Circle'

interface Props {
  humid: number
}

export default function HumidityMonitor({humid}: Props) {
  return (
    <View style={styles.humidityMonitor}>
      <ProgressCircle
        percent={humid}
        radius={90}
        borderWidth={30}
        color="#4A5CFF"
        shadowColor="#C1C1C1"
        bgColor="#fff"
      >
          <Icon 
            name = {'water-percent'}
            size = {70}
            color = {'#3B2BFF'}
          />
      </ProgressCircle>
    </View>
  
  );
}

const styles = StyleSheet.create({
  humidityMonitor: {
    alignContent: 'center',
    marginTop: 20,
    alignItems: 'center'
  } 
})