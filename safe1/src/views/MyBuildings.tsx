import React from 'react';
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import { 
  Avatar, 
  AddButton, 
  BackButton, 
  NotificationButton,
  Overlay
} from '@/components';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { Building, Device, User } from '@/models';
import { DeviceType } from '@/models/devices';
import deviceTopics from '@/utils/deviceTopics';
import deviceDefaultValues from '@/utils/deviceDefaultValues';

import ControlService from '@/services/control.service';
import DataService from '@/services/data.service';

import { connect, ConnectedProps } from 'react-redux';
import { State } from '@/redux/state';
import actions, { Action } from '@/redux/actions';

const { height, width } = Dimensions.get('screen');

const mapStateToProps = (state: State) => ({
  currentUser: state.currentUser,
  buildings: state.buildings,
  defaultBuilding: state.defaultBuilding,
  invitations: state.invitations
});

const mapDispatchToProps = {
  addBuilding: actions.addBuilding,
  addDevice: actions.addDevice,
  removeBuilding: actions.removeBuilding,
  setDefaultBuilding: actions.setDefaultBuilding,
  setInvitations: actions.setInvitations,
  removeInvitation: actions.removeInvitation,
  removeUser: actions.removeUser
};

const connector = connect(mapStateToProps, mapDispatchToProps);

interface Props extends ConnectedProps<typeof connector> {
  navigation: any,
  currentUser: User | null,
  buildings: Building[],
  defaultBuilding: Building | undefined,
  invitations: string[],
  addBuilding: (payload: Building) => Action,
  addDevice: (payload: Device) => Action,
  removeBuilding: (payload: string) => Action,
  setDefaultBuilding: (payload?: Building) => Action,
  setInvitations: (payload: string[]) => Action,
  removeInvitation: (payload: string) => Action,
  removeUser: (payload: string) => Action
};

interface MyBuildingState {
  showAddingDeviceOverlay: boolean;
  showBuildingsOverlay: boolean;
  showInvitationsOverlay: boolean;
  showInviteBoxOverlay: boolean;
  invitedEmail: string;
  addingDevice: Device;
};

const defaultDevice: Device = {
  name: "",
  topic: "bk-iot-gas",
  deviceType: "gas",
  region: "",
  protection: true,
  triggeredValue: "1",
  data: []
};

class MyBuildings extends React.Component<Props, MyBuildingState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showAddingDeviceOverlay: false,
      showBuildingsOverlay: false,
      showInvitationsOverlay: false,
      showInviteBoxOverlay: false,
      invitedEmail: "",
      addingDevice: defaultDevice
    };
  }

  componentDidMount() {
    if (this.props.currentUser === null) return;
    DataService.getInvitations(this.props.currentUser)
      .then(response => {
        if (response === null) return;
        this.props.setInvitations(response.map((building: Building) => building.name));
        if (this.props.invitations.length > 0) this.setState({ showInvitationsOverlay: true });
      }).catch(err => console.error(err));
  }

  toggleAddingDeviceOverlay = () => {
    this.setState({ showAddingDeviceOverlay: !this.state.showAddingDeviceOverlay });
  }

  toggleBuildingsOverlay = () => {
    this.setState({ showBuildingsOverlay: !this.state.showBuildingsOverlay });
  }

  toggleInvitationsOverlay = () => {
    this.setState({ showInvitationsOverlay: !this.state.showInvitationsOverlay });
  }

  toggleInviteBoxOverlay = () => {
    this.setState({ showInviteBoxOverlay: !this.state.showInviteBoxOverlay });
  }

  goToCreateBuilding = () => {
    this.props.navigation.navigate("Create Building");
  }

  goBack = () => {
    this.props.navigation.goBack();
  }

  renderMemberList = () => {
    return this.props.defaultBuilding?.members?.map((member: User, index: number) => (
      <View style={styles.memberContainer} key={index}>
        <Avatar size="medium" uri={member.photoURL} />
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{member.displayName}</Text>
        </View>
        <View style={styles.roleContainer}>
          <Text style={styles.role}>
            {this.props.defaultBuilding?.owner && member.uid == this.props.defaultBuilding?.owner.uid ? "Owner" : "Member"}
          </Text>
        </View>
        {this.props.defaultBuilding?.owner && this.props.currentUser && this.props.currentUser.uid == this.props.defaultBuilding?.owner.uid && this.props.currentUser.uid !== member.uid ?
          <TouchableOpacity style={styles.kickButtonContainer} onPress={this.alertRemoving(member.uid)}>
            <Text style={styles.kickButton}>X</Text>
          </TouchableOpacity> : <View style={styles.kickButtonContainer}></View>
        }
      </View>
    ));
  }

  alertRemoving = (uid: string) => {
    return () => {
      Alert.alert(
        "Removing user",
        "Are you sure you want to remove this user from your building?",
        [
          { text: "OK", onPress: this.kickUser(uid) },
          { text: "Cancel" }
        ]
      );
    };
  }

  kickUser = (uid: string) => {
    return () => {
      DataService.kickUser({
        uid: uid,
        buildingName: this.props.defaultBuilding?.name
      }).then(response => {
        if (response === null) {
          Alert.alert(
            "Removing failed",
            "Unknown error from server. Please try again!",
            [{ text: "OK" }]
          );
          return;
        }
        this.props.removeUser(uid);
      }).catch(err => console.error(err));
    }
  }

  switchDefaultBuilding = (building: Building) => {
    return () => {
      this.props.setDefaultBuilding(building);
      this.setState({ showBuildingsOverlay: false });
    }
  }

  renderBuildingList = () => {
    return this.props.buildings.map((building: Building, index: number) => (
      <TouchableOpacity style={styles.buildingContainer} key={index} onPress={this.switchDefaultBuilding(building)}>
        <View style={styles.buildingInfoContainer}>
          <Text style={building.name === this.props.defaultBuilding?.name ? 
            [styles.buildingName, { fontWeight: 'bold' }] : styles.buildingName
          }>{building.name}</Text>
          <Text style={styles.buildingAddress}>{building.address}</Text>
        </View>
      </TouchableOpacity>
    ));
  }

  handleInvitation = (buildingName: string, status: string) => {
    return (status === "accept") ?
      () => DataService.acceptInvitation({ uid: this.props.currentUser?.uid, buildingName: buildingName })
        .then(response => {
          if (response === null) {
            Alert.alert(
              "Accepting failed",
              "Unknown error from server. Please try again!",
              [{ text: "OK" }]
            );
            return;
          }
          this.props.removeInvitation(buildingName);
          ControlService.sub(response);
          this.props.addBuilding(response);
          if (this.props.defaultBuilding === undefined) this.props.setDefaultBuilding(response);
        }).catch(err => console.error(err))
      :
      () => DataService.declineInvitation({ uid: this.props.currentUser?.uid, buildingName: buildingName })
        .then(response => {
          if (response === null) {
            Alert.alert(
              "Rejecting failed",
              "Unknown error from server. Please try again!",
              [{ text: "OK" }]
            );
            return;
          }
          this.props.removeInvitation(buildingName);
        }).catch(err => console.error(err));
  }

  renderInvitationList = () => {
    return this.props.invitations.map((buildingName: string, index: number) => (
      <View style={styles.buildingContainer} key={index}>
        <View style={styles.buildingInfoContainer}>
          <Text style={[styles.buildingName, { fontWeight: 'bold' }]}>{buildingName}</Text>
        </View>
        <TouchableOpacity style={{ padding: 5 }} onPress={this.handleInvitation(buildingName, "accept")}>
          <Entypo name="check" size={30} color='skyblue' />
        </TouchableOpacity>
        <TouchableOpacity style={{ padding: 5 }} onPress={this.handleInvitation(buildingName, "reject")}>
          <Entypo name="cross" size={30} color='red' />
        </TouchableOpacity>
      </View>
    ));
  }

  onChangeDeviceName = (text: string) => {
    this.setState({ addingDevice: { ...this.state.addingDevice, name: text } });
  }

  onChangeDeviceRegion = (text: string) => {
    this.setState({ addingDevice: { ...this.state.addingDevice, region: text } });
  }

  onChangeDeviceType = (value: any) => {
    this.setState({ 
      addingDevice: {
        ...this.state.addingDevice,
        deviceType: value,
        topic: deviceTopics[value as DeviceType],
        triggeredValue: deviceDefaultValues[value as DeviceType]
      }
    });
  }

  onDeviceSubmit = () => {
    let device = this.state.addingDevice;
    device = { ...device, name: device.name.trim().replace(/\s\s+/, ' '), region: device.region.trim().replace(/\s\s+/, ' ') }
    if (device.name.length * device.region.length === 0) {
      Alert.alert(
        "Invalid format",
        "Please fill in all information of your device",
        [{ text: "OK" }]
      );
      return;
    }
    DataService.addBuildingDevice({
      buildingName: this.props.defaultBuilding?.name,
      device: device
    }).then(response => {
      
      if (response === null) {
        Alert.alert(
          "Adding device failed",
          "Unknown error from server. Please try again!",
          [{ text: "OK" }]
        );
        return;
      } else {
        Alert.alert(
          "Successfully added",
          "Your new device has been successfully added",
          [{ text: "OK" }]
        );
        console.log("add device" + JSON.stringify(response))
        ControlService.subOne(response);
        this.props.addDevice(response);
        this.setState({
          addingDevice: defaultDevice,
          showAddingDeviceOverlay: false
        });
      }
    }).catch(err => console.error(err));
  }

  alertClosing = () => {
    Alert.alert(
      "Closing building",
      "Are you sure you want to close this building? You can't undo this action!",
      [
        { text: "OK", onPress: this.closeBuilding },
        { text: "Cancel" }
      ]
    );
  }

  closeBuilding = () => {
    DataService.closeBuilding({
      buildingName: this.props.defaultBuilding?.name
    }).then(response => {
      if (response === null) {
        Alert.alert(
          "Closing failed",
          "Unknown error from server. Please try again!",
          [{ text: "OK" }]
        );
      }
      if (this.props.defaultBuilding) this.props.removeBuilding(this.props.defaultBuilding?.name);
      if (this.props.buildings.length > 0) {
        this.props.setDefaultBuilding(this.props.buildings[0]);
      } else {
        this.props.setDefaultBuilding();
      }
    }).catch(err => console.error(err));
  }

  alertLeaving = () => {
    Alert.alert(
      "Leaving building",
      "Are you sure you want to leave this building? You can't undo this action!",
      [
        { text: "OK", onPress: this.leaveBuilding },
        { text: "Cancel" }
      ]
    );
  }

  leaveBuilding = () => {
    DataService.kickUser({
      uid: this.props.currentUser?.uid,
      buildingName: this.props.defaultBuilding?.name
    }).then(response => {
      if (response === null) {
        Alert.alert(
          "Leaving failed",
          "Unknown error from server. Please try again!",
          [{ text: "OK" }]
        );
      }
      if (this.props.defaultBuilding) this.props.removeBuilding(this.props.defaultBuilding?.name);
      if (this.props.buildings.length > 0) {
        this.props.setDefaultBuilding(this.props.buildings[0]);
      } else {
        this.props.setDefaultBuilding();
      }
    }).catch(err => console.error(err));
  }

  onChangeInvitedEmail = (email: string) => {
    this.setState({ invitedEmail: email.trim() });
  }

  onInvitedEmailSubmit = () => {
    if (this.props.defaultBuilding?.members?.map((user: User) => user.email).indexOf(this.state.invitedEmail) !== -1) {
      Alert.alert(
        "Inviting failed",
        "User already joined your building",
        [{ text: "OK" }]
      );
      return;
    }
    DataService.inviteUser({ 
      email: this.state.invitedEmail,
      buildingName: this.props.defaultBuilding?.name
    }).then(response => {
      if (response === null) {
        Alert.alert(
          "Inviting failed",
          "Email does not exist or user is already invited",
          [{ text: "OK" }]
        );
      } else {
        Alert.alert(
          "Successfully invited",
          "Wait for your member to accept your invitation",
          [{ text: "OK" }]
        );
        this.setState({ invitedEmail: "" });
      }
    }).catch(err => console.error(err));
  }

  render() {
    return (
      <LinearGradient 
        colors={['#002150', '#4F9FFF']} 
        style={styles.container}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
      >
        <BackButton onPress={this.goBack} />
        <NotificationButton onPress={this.toggleInvitationsOverlay} />
        <AddButton onPress={this.goToCreateBuilding} />
        {this.props.buildings.length > 0 ?
          <ScrollView>
            <View style={styles.headerContainer}>
              <TouchableOpacity style={styles.switchBuildingButton} onPress={this.toggleBuildingsOverlay}>
                <Text style={styles.defaultBuildingName}>{this.props.defaultBuilding?.name}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.membersContainer}>
              {this.renderMemberList()}
            </View>
            {this.props.defaultBuilding?.owner && this.props.currentUser && this.props.currentUser.uid == this.props.defaultBuilding?.owner.uid ? 
              <View style={styles.buttonsContainer}>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity onPress={this.toggleInviteBoxOverlay}>
                    <Ionicons name="person-add-sharp" size={40} color='rgba(255, 255, 255, 0.8)' />
                  </TouchableOpacity>
                </View>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity onPress={this.toggleAddingDeviceOverlay}>
                    <MaterialCommunityIcons name="devices" size={40} color='rgba(255, 255, 255, 0.8)' />
                  </TouchableOpacity>
                </View>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity onPress={this.alertClosing}>
                    <MaterialCommunityIcons name="delete-empty" size={40} color='rgba(255, 255, 255, 0.8)' />
                  </TouchableOpacity>
                </View>
              </View>
              :
              <View style={styles.buttonsContainer}>
                <TouchableOpacity onPress={this.alertLeaving}>
                  <MaterialIcons name="exit-to-app" size={40} color='rgba(255, 255, 255, 0.8)' />
                </TouchableOpacity>
              </View>
            }
          </ScrollView>
          :
          <View style={styles.emptyContainer}>
            <FontAwesome name="building-o" size={75} color='rgba(255, 255, 255, 0.8)' />
            <Text style={styles.emptyPrimaryText}>NO BUILDINGS</Text>
            <Text style={styles.emptySecondaryText}>Press + to create a new one</Text>
          </View>
        }
        <Overlay 
          isVisible={this.state.showAddingDeviceOverlay}
          toggle={this.toggleAddingDeviceOverlay}
          height={height/4}
          children={
            <View style={styles.inputContainer}>
              <TextInput 
                style={styles.input}
                underlineColorAndroid="rgba(0, 0, 0, 0.5)"
                placeholder="Enter device's name"
                placeholderTextColor="rgba(0, 0, 0, 0.3)"
                onChangeText={this.onChangeDeviceName}
                value={this.state.addingDevice.name}
                autoCapitalize="none"
              />
              <TextInput 
                style={styles.input}
                underlineColorAndroid="rgba(0, 0, 0, 0.5)"
                placeholder="Enter device's region"
                placeholderTextColor="rgba(0, 0, 0, 0.3)"
                onChangeText={this.onChangeDeviceRegion}
                value={this.state.addingDevice.region}
                autoCapitalize="none"
              />
              <Picker
                style={{ width : '90%' }}
                selectedValue={this.state.addingDevice.deviceType}
                onValueChange={(itemValue) => this.onChangeDeviceType(itemValue)}>
                <Picker.Item label="FIRE ALARM" value="buzzer" />
                <Picker.Item label="EXTRACTOR FAN" value="fan" />
                <Picker.Item label="GAS SENSOR" value="gas" />
                <Picker.Item label="POWER SYSTEM" value="power" />
                <Picker.Item label="SMART DOOR" value="servo" />
                <Picker.Item label="SPRINKLER" value="sprinkler" />
                <Picker.Item label="TEMPERATURE SENSOR" value="temperature" />
                <Picker.Item label="LED" value="led" />
              </Picker>
              <View style={styles.submitButtonContainer}>
                <TouchableOpacity style={styles.submitButton} onPress={this.onDeviceSubmit}>
                  <Text style={styles.submitText}>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          }
        />
        <Overlay
          isVisible={this.state.showBuildingsOverlay}
          toggle={this.toggleBuildingsOverlay}
          children={
            <ScrollView>
              {this.renderBuildingList()}
            </ScrollView>
          }
        />
        <Overlay
          isVisible={this.state.showInvitationsOverlay}
          toggle={this.toggleInvitationsOverlay}
          children={
            <ScrollView>
              {this.renderInvitationList()}
            </ScrollView>
          }
        />
        <Overlay
          isVisible={this.state.showInviteBoxOverlay}
          toggle={this.toggleInviteBoxOverlay}
          height={height/5}
          children={
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                underlineColorAndroid="rgba(0, 0, 0, 0.5)"
                placeholder="Enter user's email"
                placeholderTextColor="rgba(0, 0, 0, 0.3)"
                onChangeText={this.onChangeInvitedEmail}
                value={this.state.invitedEmail}
                autoCapitalize="none"
              />
              <View style={styles.submitButtonContainer}>
                <TouchableOpacity style={styles.submitButton} onPress={this.onInvitedEmailSubmit}>
                  <Text style={styles.submitText}>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          }
        />
      </LinearGradient>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  headerContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: '20%',
    height: height/6
  },
  switchBuildingButton: {
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
  },
  defaultBuildingName: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 20
  },
  buildingContainer: {
    flexDirection: 'row',
    paddingVertical: 5,
    paddingHorizontal: 15,
    width: '100%',
    borderBottomColor: '#dedede',
    borderBottomWidth: 1
  },
  buildingInfoContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  buildingName: {
    color: 'rgba(0, 0, 0, 0.8)',
    fontSize: 22
  },
  buildingAddress: {
    color: 'rgba(0, 0, 0, 0.6)',
    fontSize: 18
  },
  membersContainer: {
    alignItems: 'center',
    paddingHorizontal: '6%'
  },
  memberContainer: {
    flexDirection: 'row',
    width: '100%',
    paddingVertical: 3
  },
  avatarContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  nameContainer: {
    flex: 3,
    justifyContent: 'center',
    paddingLeft: 20
  },
  name: {
    color: 'white',
    fontSize: 16
  },
  roleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  role: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14
  },
  kickButtonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  kickButton: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
    paddingHorizontal: width/8,
    width: '100%'
  },
  buttonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20
  },
  input: {
    fontSize: 16,
    paddingHorizontal: 10,
    color: 'rgba(0, 0, 0, 0.8)',
    width: '90%'
  },
  submitButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  submitButton: {
    backgroundColor: '#002150',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 20
  },
  submitText: {
    color: 'white',
    fontSize: 20
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyPrimaryText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white'
  },
  emptySecondaryText: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.6)'
  }
});

export default connector(MyBuildings);