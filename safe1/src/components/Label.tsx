import React from 'react';
import { 
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface Props {
  name: string,
  description: string,
  icon: JSX.Element,
  onPress: () => void,
  buttonPrimaryTextColor?: string,
  buttonSecondaryTextColor?: string,
  iconBoxColor?: string,
  borderBottomWidth?: number
}

export default class Label extends React.Component<Props> {
  render() {
    return (
      <TouchableOpacity
        style={styles(this.props).button}
        onPress={this.props.onPress}
      >
        <View style={styles(this.props).iconBox}>
          {this.props.icon}
        </View>
        <View style={styles(this.props).buttonTextContainer}>
          <Text style={styles(this.props).buttonPrimaryText}>{this.props.name}</Text>
          {this.props.description ? 
          <Text style={styles(this.props).buttonSecondaryText}>{this.props.description}</Text>: null}
        </View>
      </TouchableOpacity>
    );
  }
};

const styles = (props: any) => StyleSheet.create({
  button: {
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    borderBottomWidth: props.borderBottomWidth || 0,
    borderColor: `rgba(128, 128, 128, 0.15)`
  },
  buttonPrimaryText: {
    color: props.buttonPrimaryTextColor || 'white',
    fontSize: 16,
  },
  buttonSecondaryText: {
    color: props.buttonSecondaryTextColor || 'white',
    opacity: 0.75,
    fontSize: 12,
  },
  buttonTextContainer: {
    justifyContent: 'center',
    paddingLeft: 30
  },
  iconBox: {
    backgroundColor: props.iconBoxColor || 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    aspectRatio: 1,
    borderRadius: 16,
    padding: 6,
  }
});