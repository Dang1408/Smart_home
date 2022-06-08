import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface Props {
  onPress?: () => void
}

export default class BackButton extends React.Component<Props> {
  render() {
    return (
      <TouchableOpacity style={styles.container} onPress={this.props.onPress}>
        <MaterialIcons name="arrow-back-ios" size={35} color="white" />
      </TouchableOpacity>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 30,
    left: 15,
    zIndex: 1
  }
});