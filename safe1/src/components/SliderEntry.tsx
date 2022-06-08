import React, { Component } from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import { ParallaxImage } from 'react-native-snap-carousel'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from '../styles/sliderEntry'
import { useNavigation } from '@react-navigation/native';

const DEVICE = 'sensors'

type roomData = {
    title: string, 
    num: string,
    illustration: Object
}
interface Props {
    data: roomData,
    even: boolean,
    parallax: boolean,
    parallaxProps: Object,
}

interface TouchProps {
    Title: JSX.Element | boolean, 
    img: JSX.Element, 
    even: boolean,
    data: roomData
}

const Touch: React.FC<TouchProps> = ({Title, img, even, data}) => {
    const navigation = useNavigation();
    return(
        <TouchableOpacity
            activeOpacity={1}
            style={styles.slideInnerContainer}
            onPress={() => {navigation.navigate('OptionScreen', data);}}
            >
            <View style={styles.shadow} />
            <View style={[styles.imageContainer, even ? styles.imageContainerEven : {}]}>
                { img }
            </View>
            { Title }
        </TouchableOpacity>
    )
}
export default class SliderEntry extends Component<Props> {
    
    get image () {
        const { data: { illustration }, parallax, parallaxProps, even } = this.props;
        return parallax ? (
            <ParallaxImage
              source={illustration}
              containerStyle={[styles.imageContainer, even ? styles.imageContainerEven : {}]}
              style={styles.image}
              parallaxFactor={0.35}
              showSpinner={true}
              spinnerColor={even ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.25)'}
              {...parallaxProps}
            />
        ) : (
            <Image
              source={illustration}
              style={styles.image}
            />
        );
    }

    render () {
        const { data: { title, num, illustration }, even } = this.props;
        const Title = num ? (
            <View style={styles.textContainer}>
                <Text
                    style={styles.title}
                    numberOfLines={2}
                >
                    { num } {DEVICE}
                </Text>
                <Icon 
                    name={'circle-slice-8'}
                    size={20}
                    color={'green'}
                    style={{    
                        position: 'absolute',
                        padding: 13,
                        right: 0,
                    }}
                />
            </View>
            
        ) : false;

        return (
            <Touch Title={Title} img={this.image} even={even} data={{title, num, illustration}}/>
        );
    }
}