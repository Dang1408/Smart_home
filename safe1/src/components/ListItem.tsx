import React, { Component } from 'react';
import {TouchableOpacity, View, Text} from 'react-native';
import Styles from '../styles/listItem';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type ListItemProps = {
  item: {
    id: number,
    icon: string,
    name: string,
    color: string,
    status: string,
  },
  styles: Object,
};

interface ListItemState {
  status: string
}

export default class ListItem extends Component<ListItemProps, ListItemState> {
  constructor (props: ListItemProps) {
    super(props);
  }

  OnProtection = () => {
    const {item} = this.props;
    if (item.status === 'On' && item.name === 'Protection'){
      return (
        <Icon
          name={'toggle-switch'}
          size={40}
          color={'green'}
        />
      );
    } else if (item.status === 'Off' && item.name === 'Protection'){
      return  (
        <Icon
          name={'toggle-switch-off'}
          size={40}
          color={'black'}
        />
      );
    } else
      return <View></View>
  }

  render(){
    const {item, styles} = this.props;
    const Status = item.id !== 1 ? (
      <Text style={{fontSize: 18, color: item.color, fontWeight: 'bold'}}>
        {item.status}
      </Text>
    ) : false;
    
    return (
      <TouchableOpacity
        activeOpacity={1.0}
        style={[
          Styles.item,
          styles,
          {
            backgroundColor: '#FFFFFF',
          },
        ]}
      >
        <View style={Styles.info}>
          <Icon
            name={item.icon}
            size={40}
            color={item.color}
            style={item.id !== 1? {marginBottom: 10} : {marginBottom: 10, marginTop: 15}}
          />
          <Text style={{fontSize: 18, color: 'black', fontWeight: 'bold'}}>
            {item.name}
          </Text>
          {Status}
          {this.OnProtection()}
        </View>
      </TouchableOpacity>
    );
  }
}
