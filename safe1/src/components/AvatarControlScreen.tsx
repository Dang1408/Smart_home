import React from 'react';
import { StyleSheet, Dimensions, Text, View } from 'react-native';
import { Avatar } from 'react-native-elements';
import { connect, ConnectedProps } from 'react-redux';
import { User } from '@/models';
import { State } from '@/redux/state';
const {height, width} = Dimensions.get('screen')

const mapStateToProps = (state: State) => ({
  currentUser: state.currentUser,
  defaultBuilding: state.defaultBuilding,
});

const connector = connect(mapStateToProps);

interface Props extends ConnectedProps<typeof connector> {
  size?: number | "small" | "medium" | "large" | "xlarge",
  uri?: string,
  onPress?: () => void,
  currentUser: User | null
};

class UserAvatarControlScreen extends React.Component<Props> {
  render() {
    return (
      <View>
        {this.props.currentUser !== null ? 
            <Avatar
                size={this.props.size || "medium"}
                rounded
                source={{uri: this.props.uri || this.props.currentUser.photoURL}}
                containerStyle={styles.avatar}
            /> : 
            <Avatar
                size="large"
                rounded
                source={require('../assets/img/avatar.png')}
                containerStyle={styles.avatar}
            />
        }

        <View style={styles.avatarText}>
          <Text style={styles.primaryText}>
            Hi {this.props.currentUser !== null ? this.props.currentUser.displayName : 'User'},
          </Text> 
          <Text style = {styles.secondaryText}>Welcome 
            {(this.props.defaultBuilding && this.props.defaultBuilding.name.length < 12)? 
              ' to ' + this.props.defaultBuilding.name : ' back'} !
          </Text>
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  avatar: {
    width: 67,
    height: 66,
    left: 24,
    top: height/20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)'
  },
  avatarText: {
    position: 'absolute',
    height: 50,
    left: width/4,
    top: height/18,
  },

  primaryText: {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 24,
    lineHeight: 28,
    letterSpacing: -0.24,

    color: '#FFFFFF',
  },
  secondaryText: {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: -0.24,

    color: '#FFFFFF',
  }
});

export default connector(UserAvatarControlScreen);