import React, { useState } from 'react';
import { View, FlatList, Text, StyleSheet, Image,Button,Alert } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Building } from '@/models'
import { connect, ConnectedProps } from 'react-redux';
import { State } from '@/redux/state';
import {splitDataValue} from '@/views/NotificationDaily';
import { createIconSetFromFontello } from 'react-native-vector-icons';

const mapStateToProps = (state: State) => ({
  buildings: state.buildings,
  defaultBuilding: state.defaultBuilding,
});
const connector = connect(mapStateToProps);
interface Props extends ConnectedProps<typeof connector> {
  navigation: any,
  buildings: Building[],
  defaultBuilding: Building | undefined,
};
 
const BuildingCard = (props: any) => {
  return <View style={{marginLeft:15,marginBottom:15,flexDirection:'row'}}>
    <View style={buildingCard.iconLayout}>
      <Image
        style={buildingCard.tinyLogo}
        source={require('../assets/img/buildingIcon_Noti.png')}
      />
    </View>
    <View style={{flexDirection:'column',marginLeft:15}}>
      <Text
        style={buildingCard.nameBuilding}>Name: {props.nameBuilding}
      </Text>
      <Text 
        style={buildingCard.address}>Address: {props.address}
      </Text>
      <Text
        style={buildingCard.ownerName}>{props.ownerName}
      </Text>
    </View>
  </View >
}

const Body = (props: any) => {
  return (
    <View style={styles.body}>
      <View>
        <TouchableOpacity>
          <Text
            style={bodyStyle.title}>List of Building
        </Text>
        </TouchableOpacity>
      </View>
      <FlatList data={props.listBuilding} 
        keyExtractor={(item, index) => index+"" }
        renderItem={({item}) => 
          <TouchableOpacity onPress = {()=> props.navigation.navigate('NotificationDaily',{
                                      index:props.listBuilding.indexOf(item),
                                      nameBuilding:item.name
                                      })}>
            <BuildingCard 
              nameBuilding={item.name} address={item.address} ownerName={item.owner.displayName}>
            </BuildingCard>
          </TouchableOpacity>
    }></FlatList>
  </View>
  );
}

class NotificationHistory extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }
  createAlert(device:any,nameBuilding:any,index:number){
    Alert.alert(
      "Something went wrong !!!",
       device.name+" in building '"+nameBuilding+"' have problems." ,
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Alert"),
          style: "cancel"
        },
        { text: "", onPress:() => this.props.navigation.navigate('NotificationDaily',{nameBuilding: nameBuilding, index:index})}
      ]
    );
  }
  // this.createAlert(list[i].devices[k], list[i].name, i);
  CheckPushNoti(list:any){
    if(list){
      for(let i=list.length-1;i>=0;i--){
        for(let k=0;k<list[i].devices.length;k++){
          if(list[i].devices[k].data.length){
            let value=splitDataValue(list[i].devices[k].data[list[i].devices[k].data.length-1]?.value);
            if(list[i].devices[k].deviceType=="gas"){       
              if(Number(value)==1){
                this.createAlert(list[i].devices[k],list[i].name, i);
              }
            }
            else if(list[i].devices[k].deviceType=="temperature"){
              if(Number(value)>60){
                ///console.log("trigger pls")
                this.createAlert(list[i].devices[k], list[i].name,i);
              }
            }
          }
        }  
      }
    }
    return;
  }
  render() {
    return (
      <View style={styles.option}>
        {this.CheckPushNoti(this.props.buildings)}
        {/* <Button title="name" onPress= {()=>{CheckPushNoti(this.props.buildings)}}></Button> */}
        <Body 
          listBuilding={this.props.buildings} navigation={this.props.navigation}>
        </Body>
      </View>
    )
  }
}

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
  tinyLogo: {
    width: 50,
    height: 50,
  },
})
const bodyStyle = StyleSheet.create({
  title: {
    marginLeft: 20,
    marginTop: 20,
    marginBottom:20,
    fontSize: 30,
    color: "#aac4ec"
  },
})
const buildingCard = StyleSheet.create({
  iconLayout: {
    // justifyContent: 'center',
    marginTop: 5,
    width: 70,
    height: 65,
    borderRadius: 12,
    backgroundColor: "#6495ed"
  },
  tinyLogo: {
    width: 60,
    height: 67,
  },
  nameBuilding: {
    marginTop: 1,
    fontSize: 18
  },
  address: {
    marginTop: 1,
    fontSize: 18
  },
  ownerName: {
    fontSize: 20,
    marginTop: 1,
    color: "#aac4ec"
  },
})

export default connector(NotificationHistory);
