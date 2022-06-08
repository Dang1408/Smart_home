import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface Props {
  onPress?: () => void
}

export default class BackButton extends React.Component<Props> {
  render() {
    return (
      <TouchableOpacity style={styles.container} onPress={this.props.onPress}>
        <Ionicons name="notifications" size={35} color="white" />
      </TouchableOpacity>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 30,
    right: 15,
    zIndex: 1
  }
});