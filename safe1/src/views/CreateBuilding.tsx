import React from 'react';
import { 
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { BackButton, Input } from '@/components';
import deviceTopics from '@/utils/deviceTopics';
import deviceDefaultValues from '@/utils/deviceDefaultValues';

import { connect, ConnectedProps } from 'react-redux';
import { State } from '@/redux/state';
import actions, { Action } from '@/redux/actions';

import { Building, Device, User } from '@/models';
import { DeviceType } from '@/models/devices';

import ControlService from '@/services/control.service';
import DataService from '@/services/data.service';

const { width } = Dimensions.get("screen");

const mapStateToProps = (state: State) => ({
  currentUser: state.currentUser,
  defaultBuilding: state.defaultBuilding
});

const mapDispatchToProps = {
  addBuilding: actions.addBuilding,
  setDefaultBuilding: actions.setDefaultBuilding
};

const connector = connect(mapStateToProps, mapDispatchToProps);

interface Props extends ConnectedProps<typeof connector> {
  navigation: any,
  currentUser: User | null,
  defaultBuilding: Building | undefined,
  addBuilding: (payload: Building) => Action,
  setDefaultBuilding: (payload?: Building) => Action
};

interface CustomState {
  buildingSettings: Building
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

class CreateBuilding extends React.Component<Props, CustomState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      buildingSettings: {
        name: "",
        address: "",
        devices: [{...defaultDevice}],
        members: this.props.currentUser ? [this.props.currentUser] : [],
        owner: this.props.currentUser
      },
    };
  }

  onChangeBuildingName = (text: string) => {
    this.setState({ buildingSettings: { ...this.state.buildingSettings, name: text } });
  }

  onChangeBuildingAddress = (text: string) => {
    this.setState({ buildingSettings: { ...this.state.buildingSettings, address: text } });
  }

  onChangeDeviceName = (index: number) => {
    return (text: string) => {
      let devices = this.state.buildingSettings.devices;
      devices[index].name = text;
      this.setState({ buildingSettings: { ...this.state.buildingSettings, devices: [...devices] } });
    }
  }

  onChangeDeviceRegion = (index: number) => {
    return (text: string) => {
      let devices = this.state.buildingSettings.devices;
      devices[index].region = text;
      this.setState({ buildingSettings: { ...this.state.buildingSettings, devices: [...devices] } });
    }
  }

  onChangeDeviceType = (index: number) => {
    return (value: any) => {
      let devices = this.state.buildingSettings.devices;
      devices[index].deviceType = value;
      devices[index].topic = deviceTopics[value as DeviceType];
      devices[index].triggeredValue = deviceDefaultValues[value as DeviceType];
      this.setState({ buildingSettings: { ...this.state.buildingSettings, devices: [...devices] } });
    }
  }

  addDeviceInput = () => {
    this.setState({ 
      buildingSettings: {
        ...this.state.buildingSettings,
        devices: [ 
          ...this.state.buildingSettings.devices,
          {...defaultDevice}
        ]
      }
    });
  }

  renderDeviceInputs = (item: Device, index: number) => {
    return (
      <View style={styles.deviceInformationContainer} key={index.toLocaleString()}>
        <View style={styles.deviceInformationRow}>
          <Input 
            style={{ flex: 1, marginHorizontal: 3 }}
            placeholder="Device's name (*)"
            fontSize={14}
            value={item.name}
            onChangeText={this.onChangeDeviceName(index)}
          />
          <Input 
            style={{ flex: 1, marginHorizontal: 3 }}
            placeholder="Device's region (*)"
            fontSize={14}
            value={item.region}
            onChangeText={this.onChangeDeviceRegion(index)}
          />
        </View>
        <View style={styles.deviceInformationRow}>
          <Picker
            style={{ width: '75%', color: 'white' }}
            selectedValue={item.deviceType}
            onValueChange={(itemValue) => this.onChangeDeviceType(index)(itemValue)}>
            <Picker.Item label="FIRE ALARM" value="buzzer" />
            <Picker.Item label="EXTRACTOR FAN" value="fan" />
            <Picker.Item label="GAS SENSOR" value="gas" />
            <Picker.Item label="POWER SYSTEM" value="power" />
            <Picker.Item label="SMART DOOR" value="servo" />
            <Picker.Item label="SPRINKLER" value="sprinkler" />
            <Picker.Item label="TEMPERATURE SENSOR" value="temperature" />
            <Picker.Item label="LED" value="led" />
          </Picker>
        </View>
      </View>
    );
  }

  onSubmit = () => {
    let building = this.state.buildingSettings;
    building.name = building.name.trim().replace(/\s\s+/, ' ');
    building.address = building.address?.trim().replace(/\s\s+/, ' ');
    building.devices = building.devices
      .map((device: Device) => ({ ...device, name: device.name.trim().replace(/\s\s+/, ' '), region: device.region.trim().replace(/\s\s+/, ' ') }))
      .filter((device: Device) => device.name.length * device.region.length > 0);
    this.setState({ buildingSettings: { ...building } });
    if (building.name.length == 0) {
      Alert.alert(
        "Invalid form",
        "Please specify your building's name!",
        [{ text: "OK" }]
      );
      return;
    }
    DataService.createBuilding(building)
      .then(response => {
        if (response === null) {
          Alert.alert(
            "Creating failed",
            "Unknown error from server. Please try again!",
            [{ text: "OK" }]
          );
          return;
        } else {
          ControlService.sub(response);
          this.props.addBuilding(response);
          if (this.props.defaultBuilding === undefined) this.props.setDefaultBuilding(response);
          this.props.navigation.goBack();
        }
      }).catch(err => console.error(err));
  }

  goBack = () => {
    this.props.navigation.goBack();
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
        <ScrollView>
          <View style={styles.logoContainer}>
            <Image source={require('@/assets/logo.png')} />
          </View>
          <View style={styles.inputContainer}>
            <Input 
              style={{ marginVertical: 10 }}
              title="Name"
              placeholder="Building's name (*)"
              value={this.state.buildingSettings.name}
              onChangeText={this.onChangeBuildingName}
            />
            <Input 
              style={{ marginVertical: 10 }}
              title="Address"
              placeholder="Building's location"
              value={this.state.buildingSettings.address}
              onChangeText={this.onChangeBuildingAddress}
            />
            <View style={styles.devicesInputContainer}>
              <Text style={styles.devicesTitle}>Devices</Text>
              {this.state.buildingSettings.devices.map(this.renderDeviceInputs)}
              <TouchableOpacity style={styles.addButtonContainer} onPress={this.addDeviceInput}>
                <Ionicons name="add-circle-outline" size={50} color="rgba(255, 255, 255, 0.6)" />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        <TouchableOpacity style={styles.saveButtonContainer} onPress={this.onSubmit}>
          <AntDesign name="check" size={40} color='white' />
        </TouchableOpacity>
      </LinearGradient>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 15
  },
  inputContainer: {
    paddingHorizontal: width/15
  },
  devicesInputContainer: {
    marginVertical: 15,
  },
  devicesTitle: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 16,
    paddingHorizontal: 10,
  },
  deviceInformationContainer: {
    padding: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 20,
    marginVertical: 2
  },
  deviceInformationRow: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  addButtonContainer: {
    alignItems: 'center',
    paddingVertical: 10
  },
  saveButtonContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
});

export default connector(CreateBuilding);