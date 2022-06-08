import React, {useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  ScrollView,
  View,
  Alert
} from 'react-native';
import { Building } from '@/models';
import { Svg, Rect, Text as TextSVG }  from 'react-native-svg'
import LinearGradient from 'react-native-linear-gradient'
import { LineChart } from 'react-native-chart-kit'
import Feather from 'react-native-vector-icons/Feather'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { connect, ConnectedProps } from 'react-redux';
import { State } from '@/redux/state';
import {Device} from '@/models';

const { width } = Dimensions.get('screen')

  
const mapStateToProps = (state: State) => ({
  currentUser: state.currentUser,
  defaultBuilding: state.defaultBuilding,
  buildings: state.buildings
});

const connector = connect(mapStateToProps);

interface Props extends ConnectedProps<typeof connector> {
  navigation: any,
  defaultBuilding: Building | undefined,
};

interface CustomState {
  tooltipPos: any
}

class Temperature extends React.Component<Props, CustomState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      tooltipPos: {
        x: 0,
        y: 0,
        visible: false,
        time: "",
        value: 0
      }
    }
  };
  
  

  getDevices = (typeDevice: string = "") => {
    if (typeDevice === "") {
      return this.props.defaultBuilding?.devices
    } else {
      return this.props.defaultBuilding?.devices.filter(device => device.deviceType == typeDevice)
    }
  }

  getTempData = () => {
    let temp_data = {
      temp: [] as Array<Number>,
      label: [] as Array<Date>
    }
    if (this.props.defaultBuilding !== undefined) {
      const devices = this.getDevices("temperature")
      console.log('temp------------------', devices)
      devices?.forEach((device: Device) => {
        device.data.forEach(data => {
          const time = new Date(data.time)
          if (temp_data.temp.length === 7) {
            temp_data.temp.shift()
            temp_data.label.shift()
          }
          temp_data.temp.push(Number(data.value.substring(0, 2)))
          temp_data.label.push(time)
        });
      });
    }
    return temp_data
  }
  
  getHourMinuteSecond = (date: Date) => {
    const hour = this.formatTime(date.getHours())
    const minute = this.formatTime(date.getMinutes())
    const second = this.formatTime(date.getSeconds())
    return `${hour}:${minute}:${second}`
  } 

  formatTime = (num: number) => {
    if (num < 10) {
      return `0${num}`
    }
    return `${num}`
  }

  checkIfHadDevice = () => {
    return this.getDevices("temperature")?.length !== 0
  }

  renderDeviceEmptyBuilding = () => {
    return(
      <View style={styles.emptyContainer}>
        
        <FontAwesome name="building-o" size={75} color='rgba(255, 255, 255, 0.8)' />
        <Text style={styles.emptyPrimaryText}>NO BUILDINGS</Text>
        <Text style={styles.emptySecondaryText}>Please create at least one building!</Text>
    </View>
    )  
  }

  renderEmptyDevice = () => {
      return(
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="leak" size={75} color='rgba(255, 255, 255, 0.8)'/>
          <Text style={styles.emptyPrimaryText}>NO DEVICES</Text>
          <Text style={styles.emptySecondaryText}>Please add a temperature device!</Text>
        </View>
      )    
  }

  renderDeviceEmptyData = () => {
    return(
      <View style={styles.emptyContainer}>
        <MaterialCommunityIcons name="database" size={75} color='rgba(255, 255, 255, 0.8)'/>
        <Text style={styles.emptyPrimaryText}>NO DATA</Text>
        <Text style={styles.emptySecondaryText}>Temperature device has not received any data!</Text>
      </View>
    )  
  }

  renderData = (temp_data: any) => {
    let data = {
      labels: temp_data.label.slice(-7),
      datasets: [
        {
          data: temp_data.temp.slice(-7),
          color: () => 'rgba(250, 218, 94, 0.8)'
        }               
      ]
    }
    if (this.checkIfHadDevice() === true) {
      return(
        <View style={styles.container}>
          <View style={styles.header}></View>
          {this.getTempData().label.length !== 0 ? 
          <ScrollView style={{flex: 1}} contentContainerStyle={{alignItems:'center'}}>
            <LineChart
              onDataPointClick={({ value, index, x, y }) => {
                // check if we have clicked on the same point again
                let isSamePoint = (this.state.tooltipPos.x === x
                                    && this.state.tooltipPos.y ===  y)
              
                // if clicked on the same point again toggle visibility
                // else,render tooltip to new position and update its value
                isSamePoint ? this.setState((previousState)=> ({
                                    tooltipPos: {
                                        ...previousState.tooltipPos, 
                                        value: value,
                                        time: new Date(data.labels[index]),
                                        visible: !previousState.tooltipPos.visible}
                                    }))
                              : 
                              this.setState({
                                tooltipPos: {
                                    x: x, 
                                    y: y,
                                    value: value,
                                    time: new Date(data.labels[index]),
                                    visible: true
                                  }
                                })
            }} // end function,
            decorator={() => {
              return this.state.tooltipPos.visible ? <View>
              <Svg>
                  <Rect 
                    x={this.state.tooltipPos.x -40}
                    y={this.state.tooltipPos.y + 10}
                    width="80"  
                    height="70"
                    fill="white"
                    rx={5}
                    />
                  <TextSVG
                    x={this.state.tooltipPos.x}
                    y={this.state.tooltipPos.y + 25}
                    fill="black"
                    fontSize="12.5"
                    textAnchor="middle">
                    {this.state.tooltipPos.time.toDateString().substring(4)}
                  </TextSVG>
                  <TextSVG
                    x={this.state.tooltipPos.x}
                    y={this.state.tooltipPos.y + 50}
                    fill="black"
                    fontSize="12.5"
                    textAnchor="middle">
                    {this.getHourMinuteSecond(new Date(this.state.tooltipPos.time))}
                  </TextSVG>
                  <TextSVG
                    x={this.state.tooltipPos.x-5}
                    y={this.state.tooltipPos.y + 75}
                    fill="black"
                    fontSize="12.5"
                    textAnchor="middle">
                    {this.state.tooltipPos.value}°C
                  </TextSVG>
              </Svg>
          </View> : null
          }}
          data={data}
          width={width} // from react-native
          height={400}
          yAxisSuffix="°C"
          yAxisInterval={1} // optional, defaults to 1
          chartConfig={{
            strokeWidth: 3,
            backgroundGradientFromOpacity: 0,
            backgroundGradientToOpacity: 0,
            backgroundGradientTo: "#ffa726",
            color: () => `rgba(141, 193, 255, 1)`,
            labelColor: () => 'white',
            style: {
              borderRadius: 16
            },
            propsForDots: {
              r: "2",
            },
            propsForBackgroundLines: {
              strokeDasharray: "", // solid background lines with no dashes
              opacity: 0.15
            }
          }}
          formatYLabel={(y: string) => Number(y).toString()}
          formatXLabel = {(x: string) => {
            let idx = data.labels.indexOf(x)
            if (idx % 2 === 0) {
              return this.getHourMinuteSecond(new Date(x))
            } 
            return ""
          }}
          fromZero
          withVerticalLines={false}
          bezier
          style={styles.chart}
        />
            <View style={styles.tempContainer}>
              <Feather name = "sun" size = {30} color = "white"/>
              <View style={styles.tempFirstBox}>
                <Text style={{color: "rgba(255, 255, 255, 0.3)"}}>Highest temperature</Text>
              </View>
              <View style={styles.tempSecondBox}>
                <Text style={{color:"white"}}>{Math.max(...temp_data.temp)}°C</Text>
              </View>          
            </View>
            <View style={styles.tempContainer}>
              <FontAwesome name = "snowflake-o" size = {30} color = "white"/>
              <View style={styles.tempFirstBox}>
                <Text style={{color: "rgba(255, 255, 255, 0.3)"}}>Lowest temperature</Text>
              </View>
              <View style={styles.tempSecondBox}>
                <Text style={{color:"white"}}>{Math.min(...temp_data.temp)}°C</Text>
              </View>          
            </View>
          </ScrollView>
          : this.renderDeviceEmptyData()}
        </View>
      )
    }
    return this.renderEmptyDevice()
  }
  

  render(){
    let temp_data = this.getTempData()

    return (
      <LinearGradient 
        colors={['#4F9FFF', '#002150']} 
        style={styles.container}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 0.5}}
      >
        {this.props.defaultBuilding !== undefined? 
          this.renderData(temp_data)
          : this.renderDeviceEmptyBuilding()}
      </LinearGradient>
    )
  }
}

export default connector(Temperature);

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    padding: 40,
    backgroundColor: 'transparent'
  },
  chart: {
    alignItems: 'center'
  },
  tempContainer: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'space-evenly',
    borderRadius: 16,
    width: width * 0.8,
    height: 80,
    backgroundColor: 'rgba(5, 28, 63, 0.5)'
  },
  tempFirstBox: {
    height: 70,
    justifyContent: 'space-around'
  },
  tempSecondBox: {
    height: 70,
    justifyContent: 'space-around'
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