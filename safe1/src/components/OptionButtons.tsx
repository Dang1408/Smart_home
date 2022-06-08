import React, { Component } from 'react';
import { View } from 'react-native'
import ScrollingButtonMenu from '@/components/ScrollButton';

const buttons = [
  {
    id: 0,
    name: 'Protection'
  },
  {
    id: 1,
    name: 'Temperature'
  },
  {
    id: 2,
    name: 'Settings'
  }
]

interface Props {
  changeSelectedID: (newValue: number) => void
}

export default class OptionButtons extends Component<Props> {

  render () {
    return (
      <View>
      <ScrollingButtonMenu 
        items={buttons}
        selected={buttons[0].id}
        changeSelectedID={this.props.changeSelectedID}
        callbackId={(id:number) => {}}
      />
      </View>
    );
  }
}

