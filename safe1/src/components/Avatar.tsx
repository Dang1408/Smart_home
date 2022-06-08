import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Avatar } from 'react-native-elements';
import { connect, ConnectedProps } from 'react-redux';
import { User } from '@/models';
import { State } from '@/redux/state';

const mapStateToProps = (state: State) => ({
  currentUser: state.currentUser
});

const connector = connect(mapStateToProps);

interface Props extends ConnectedProps<typeof connector> {
  size?: number | "small" | "medium" | "large" | "xlarge",
  uri?: string,
  onPress?: () => void,
  currentUser: User | null
};

class UserAvatar extends React.Component<Props> {
  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress}>
        {this.props.currentUser !== null ? 
          <Avatar
            size={this.props.size || "medium"}
            rounded
            source={{uri: this.props.uri || this.props.currentUser.photoURL}}
          /> : null}
      </TouchableOpacity>
    );
  }
};

const styles = StyleSheet.create({
  avatar: {
    flexWrap: 'wrap',
    resizeMode: 'center'
  }
});

export default connector(UserAvatar);