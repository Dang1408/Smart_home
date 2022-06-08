import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

interface Props {
  onPress?: () => void
}

export default class BackButton extends React.Component<Props> {
  render() {
    return (
      <TouchableOpacity style={styles.container} onPress={this.props.onPress}>
        <AntDesign name="pluscircleo" size={45} color="white" />
      </TouchableOpacity>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 30,
    right: 15,
    zIndex: 1
  }
});