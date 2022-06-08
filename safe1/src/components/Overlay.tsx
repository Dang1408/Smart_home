import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { Overlay } from 'react-native-elements';

const { height, width } = Dimensions.get('screen');

interface Props {
  isVisible: boolean;
  toggle: () => void;
  children?: React.ReactNode;
  height?: number;
};

export default class CustomOverlay extends React.Component<Props> {
  render() {
    return (
      <Overlay
        isVisible={this.props.isVisible}
        onBackdropPress={this.props.toggle}
        overlayStyle={[styles.overlay, { height: this.props.height || height/2 }]}
        children={this.props.children}
      />
    );
  }
};

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    padding: 0,
    width: 2*width/3
  }
});