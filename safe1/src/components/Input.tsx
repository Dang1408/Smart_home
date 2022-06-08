import React from 'react';
import { 
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

interface Props {
  title?: string,
  placeholder?: string,
  onChangeText?: (text: string) => void,
  value?: string,
  style?: any,
  fontSize?: number
};

export default class Input extends React.Component<Props> {
  render() {
    return (
      <View style={[styles.textInputContainer, this.props.style]}>
        {this.props.title ? <Text style={styles.textInputTitle}>{this.props.title}</Text> : null}
        <TextInput
          style={[styles.textInput, { fontSize: this.props.fontSize || 16 }]}
          underlineColorAndroid="rgba(255, 255, 255, 0.5)"
          placeholder={this.props.placeholder || ""}
          placeholderTextColor="rgba(255, 255, 255, 0.3)"
          onChangeText={this.props.onChangeText}
          value={this.props.value || ""}
          autoCapitalize="none"
        />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  textInputContainer: {
    // width: '100%',
  },
  textInputTitle: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 16,
    paddingHorizontal: 10,
  },
  textInput: {
    color: 'white',
    fontSize: 16,
    paddingHorizontal: 10
  }
});