import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Icon } from 'react-native-elements'
import { connect, ConnectedProps } from 'react-redux';
import { Building, Device } from '@/models';
import { DeviceType } from '@/models/devices';
import { State } from '@/redux/state';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';

const mapStateToProps = (state: State) => ({
  buildings: state.buildings,
});
const connector = connect(mapStateToProps);
interface Props extends ConnectedProps<typeof connector> {
  navigation: any,
  buildings: Building[],
  route: any
};

const DeviceCard = (props: any) => {
  if (props.deviceType == "gas") {
    return (<View style={{marginLeft:20,marginBottom:15,flexDirection:'row'}}>
      <View style={deviceCardStyle.iconLayout}>
        <Image
          style={deviceCardStyle.tinyLogo}
          source={require('../assets/img/gasIcon_Noti.png')}
        />
      </View>
      <View style={{flexDirection:'column',marginLeft:20}}>
        <Text
          style={deviceCardStyle.nameDevice}>Name: {props.nameDevice}
        </Text>
        <Text 
          style={deviceCardStyle.time}>{props.time}
        </Text>
        <Text
          style={deviceCardStyle.region}>Region: {props.region}
        </Text>
      </View>
      <Text
        style={deviceCardStyle.data}>{props.data}
      </Text>
    </View >)
  }
  else{
    return(<View style={{marginLeft:20,marginBottom:15,flexDirection:'row'}}>
      <View style={deviceCardStyle.iconLayout}>
        <Image
          style={deviceCardStyle.tinyLogo}
          source={require('../assets/img/tempIcon_Noti.png')}
        />
      </View>
      <View style={{flexDirection:'column',marginLeft:20}}>
        <Text
          style={deviceCardStyle.nameDevice}>Name: {props.nameDevice}
        </Text>
        <Text 
          style={deviceCardStyle.time}>{props.time}
        </Text>
        <Text
          style={deviceCardStyle.region}>Region: {props.region}
        </Text>
      </View>
      <Text
        style={deviceCardStyle.data}>{props.data}
      </Text>
    </View >)
  }
}
function findingGasTempDeviceList(list: any) {
  let listDecive: Device[]=[];
  var idx=0;
  for(var i in list){
    if(list[i].deviceType=="gas"){
      listDecive[idx] = list[i];
      idx++;
    }
  }
  for(var i in list){
    if(list[i].deviceType == "temperature"){
      listDecive[idx] = list[i];
      idx++;
    }
  }
  return listDecive;
}
export function splitDataValue(data:any){
  for(let i=1 ; i < data.length;i++){
    if(data[i] == "-"){
      data=data.substring(0,i);
    }
  }
  return data;
}

interface DeviceForm {
  name:string,
  topic:string,
  deviceType:DeviceType,
  region:string,
  protection:boolean,
  data:{time:string,value:string}
};

var listDeviceForm:DeviceForm[]=[];
class NotificationDaily extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }
  findListWarningDevice = () => {
    return findingGasTempDeviceList(this.props.buildings[this.props.route.params.index].devices)
      // .map((device) => {return device.data;})
      .forEach((device) => {
        if (device.deviceType == "gas") {
          device.data.filter((data) => { return Number(data.value) == 1 })
            .map((data) => {
              var newDevice: DeviceForm={
                name: device.name,
                topic: device.topic,
                deviceType: device.deviceType,
                region: device.region,
                protection: device.protection,
                data: {time: new Date(data.time).toLocaleString(),value: data.value }
              }
              listDeviceForm.push(newDevice);
            })
        } else {
          device.data.filter((data) => { return Number(splitDataValue(data.value)) > 60 })
            .map((data) => {
              var newDevice: DeviceForm = {
                name: device.name,
                topic: device.topic,
                deviceType: device.deviceType,
                region: device.region,
                protection: device.protection,
                data: {time: new Date(data.time).toLocaleString(),value: splitDataValue(data.value)}
              }
              listDeviceForm.push(newDevice);
            })
        }
      },
      )
  }

  renderWarningDevice = () => {
    let index = 0;
    let listDeviceFormReverse = listDeviceForm.reverse();
    return listDeviceFormReverse.map((device) => (<View key={index++}>
      <DeviceCard nameDevice={device.name} deviceType={device.deviceType} time={device.data.time ? device.data.time : "None"} region={device.region} data={device.data.value ? device.data.value : "None"}></DeviceCard>
    </View>))
  }
  render() {
    return (
      <View style={styles.option}>
        <Text style={bodyStyle.nameBuilding}>{this.props.route.params.nameBuilding}</Text>
        <View style={styles.body}>
          <View style={{flexDirection:"row"}}>
            <TouchableOpacity>
              <Text
                style={bodyStyle.detail}>More details
          </Text>
            </TouchableOpacity>
            <View style={bodyStyle.iconLayout}>
              <TouchableOpacity>
                <Icon
                  name='search-outline'
                  type='ionicon'
                  color='#aac4ec'
                  size={23}
                />
              </TouchableOpacity>
            </View>
          </View>
          <ScrollView>
            {this.findListWarningDevice()}
            {this.renderWarningDevice()}
            {listDeviceForm = []}
          </ScrollView>
        </View>
      </View>
    )
  }
}
const bodyStyle = StyleSheet.create({
  nameBuilding: {
    marginLeft: 160,
    marginBottom: 15,
    fontSize: 23,

    color: "#21130d"
  },
  detail: {
    marginLeft: 30,
    marginTop: 20,
    marginBottom: 15,
    fontSize: 23,

    color: "#41628a"
  },
  iconLayout: {
    // justifyContent: 'center',
    marginTop: 15,
    marginLeft: "auto",
    marginRight: 25,
    width: 40,
    height: 40,
    borderRadius: 12,
    borderColor: "#aac4ec",
    borderWidth: 0.6,
    backgroundColor: "#fff"
  },
  dayTime: {
    marginLeft: 30,
    marginTop: 10,
    fontSize: 23,
    color: "#aac4ec"
  }
})

const deviceCardStyle = StyleSheet.create({
  iconLayout: {
    // justifyContent: 'center',
    marginTop: 5,
    width: 55,
    height: 65,
    borderRadius: 12,
    backgroundColor: "#6495ed"
  },
  deviceType: {
    marginTop: 1,
    fontSize: 18
  },
  nameDevice: {
    marginTop: 5,
    fontSize: 18
  },
  region: {
    fontSize: 20,
    marginTop: 10,
    color: "#aac4ec"
  },
  data: {
    marginTop: 20,
    fontSize: 23,
    // borderColor: 'black',
    // borderWidth: 1,
    // justifyContent: 'center',
    marginLeft: "auto",
    marginRight: 20,
    color: "#ff0000"
  },
  tinyLogo: {
    width: 50,
    height: 50,
  },
  time: {
    marginTop: 10,
    fontSize: 16
  }
})

const styles = StyleSheet.create({
  option: {
    flex: 1,
    backgroundColor: '#6495ed',
  },
  body: {
    flex: 1,
    backgroundColor: "white",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
})

export default connector(NotificationDaily);

