import React from 'react'
import { Icon } from 'react-native-elements'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Temperature from './Temperature';
import GasConcentration from './GasConcentration';
import FontAwesome from 'react-native-vector-icons/FontAwesome'

const {Navigator, Screen} = createBottomTabNavigator();

class Dashboard extends React.Component {
    render() {
        return(
            <Navigator 
                initialRouteName="Temperature"
                tabBarOptions={{
                    activeTintColor: 'rgba(39, 140, 204, 1)',
                  }}
                >
                <Screen 
                    name="Temperature" 
                    component={Temperature} 
                    options={{
                        tabBarIcon: ({ color, size }) => {
                            return(
                            <Icon
                                name="thermometer-three-quarters"
                                type="font-awesome"
                                color={color}
                                size={size}
                            />)
                        }
                    }}                    
                    />
                <Screen 
                    name="Gas Concentration"
                    component={GasConcentration}
                    options={{
                        tabBarIcon: ({ color, size }) => {
                            return(
                            <Icon
                                name="wind"
                                type="feather"
                                color={color}
                                size={size}
                            />)
                        }
                    }}   
                />
            </Navigator>
        )
    }
}

export default Dashboard