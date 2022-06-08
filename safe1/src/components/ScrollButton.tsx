import React from 'react';
import {DEFAULT} from '@/utils/default.data';
import {Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

type data = {
    id: number, 
    name: string
}

type Props = typeof ScrollingButtonMenu.defaultProps & {
    items: Array<data>, 
    selected: number,
    upperCase?: boolean, 
    selectedOpacity?: number, 
    activeBackgroundColor?: string, 
    activeColor?: string, 
    buttonStyle?: Object, 
    containerStyle?: Object,
    onPress?: (route: data) => {},
    changeSelectedID?: (newValue: number) => void,
    callbackId: (id: number) => void,
}

interface State {
    index: number
}

export default class ScrollingButtonMenu extends React.Component <Props, State>{
    private scroll: any;
    private dataSourceCords: Array<{x: number, width: number}>;
    constructor(props: Props) {
        super(props);

        this.scroll = React.createRef();
        this.dataSourceCords = [];

        this.state = {
            index: 0,
        };
    }

    static defaultProps = {
        upperCase: false,
        textStyle: {
            fontFamily: 'Roboto', 
            padding: 10,
            color: '#FFFFFF',
            fontSize: 16,
            fontWeight: 'bold',

        },
        buttonStyle: {
            borderRadius: 10,
            marginRight: 10,
        },
        activeColor: '#FFFFFF',
        activeBackgroundColor: '#434FEA',
        selected: NaN,
        onPress: () => {},
        selectedOpacity: 0.7,
        containerStyle: {},
    }

    componentDidUpdate(prevProps: Props) {
        const {selected} = this.props;
        const isOk = false;
        if(typeof(selected) === 'number'){
            const isOk = true;
        }
        if (selected && isOk && prevProps.selected != this.state.index) {
            this.setState({index: selected});
        }
    }

    componentDidMount() {
        const {selected} = this.props;
        if (selected) {
            this.setState({index: selected}, () => {
                setTimeout(() => {
                    this._scrollTo();
                }, 200);
            });
        }
    }

    _scrollTo() {
        if(this.props.items.length === 3){
            return;
        }
        const {index} = this.state;
        const screen1 = screenWidth / 2;
        const elementOffset = this.dataSourceCords[index];
        if (elementOffset !== undefined) {
            let x = elementOffset.x - (screen1 - (elementOffset.width / 2)) + 12;
            if (index == DEFAULT.length - 1){
                let lastOffset = this.dataSourceCords[index-1];
                x = lastOffset.x - (screen1 - (lastOffset.width / 2)) + 12;
            }
            this.scroll.scrollTo({
                y: 0,
                x: x,
                animated: true,
            });
        }

    }

    changeId(){
        this.props.callbackId(this.state.index)
    }

    render() {
        const {items, upperCase, selectedOpacity, activeBackgroundColor, activeColor, buttonStyle, containerStyle} = this.props;
        const {index} = this.state;

        return (
            <View style={[
                styles.scrollArea,
                containerStyle,
            ]}>
                <ScrollView
                    horizontal={true}
                    pagingEnabled={false}
                    showsHorizontalScrollIndicator={false}
                    ref={(node) => this.scroll = node}
                    style={styles.scroll}
                    contentContainerStyle={styles.scrollContainer}
                    scrollEventThrottle={200}
                >
                    {
                        items.map((route, i) => (
                            <TouchableOpacity
                                style={[
                                    styles.tabItem,
                                    (index === route.id ? styles.tabItemFocused : {}),
                                    (buttonStyle ? buttonStyle : false),
                                    (index === route.id && activeBackgroundColor ? {backgroundColor: activeBackgroundColor} : false),
                                ]}
                                key={(route.id ? route.id : i).toString()}
                                onPress={() => this.setState({index: route.id}, () => setTimeout(() => {
                                        this._scrollTo();
                                        this.changeId();
                                        if (this.props.changeSelectedID){
                                            this.props.changeSelectedID(this.state.index);
                                        }
                                        return this.props.onPress(route);
                                    }, 50), 
                                )}
                                onLayout={(event) => {
                                    const layout = event.nativeEvent.layout;
                                    this.dataSourceCords[route.id] = layout;
                                }}
                                activeOpacity={selectedOpacity}
                            >
                                <Text style={[
                                    styles.tabItemText,
                                    (index == route.id ? styles.tabItemTextFocused : {}),
                                    (index == route.id && activeColor ? {color: activeColor} : false),
                                ]}>
                                    {upperCase ? route.name.toUpperCase() : route.name}
                                </Text>
                            </TouchableOpacity>
                        ))
                    }
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    scrollArea: {
        paddingTop: 5,
        paddingHorizontal:12,
    },
    scroll: {},
    scrollContainer: {},
    tabItem: {
        borderRadius: 5,
        backgroundColor: '#FFFFFF',
        padding: 8,
        width: (screenWidth - 44)/3,
    },
    tabItemText: {
        color: '#000000',
        fontFamily: 'Roboto',
        fontSize: 18,
        fontWeight: 'bold',
        fontStyle: 'normal',
        textAlign: 'center',
        paddingTop: 5,
        lineHeight: 20,
    },
    tabItemFocused: {
        borderWidth: 0,
    },
    tabItemTextFocused: {
        color: '#fff',
    },
});