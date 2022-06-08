import { StyleSheet, Dimensions, Platform } from 'react-native';
import { colors } from './carousel';
import { itemHeight } from './roomSliderEntry';

const IS_IOS = Platform.OS === 'ios';
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');


function wp (percentage: number) {
    const value = (percentage * viewportWidth) / 100;
    return Math.round(value);
}

const slideHeight = viewportHeight * 0.30;
const slideWidth = wp(75);
const itemHorizontalMargin = wp(2);

export const sliderWidth = viewportWidth;
export const itemWidth = slideWidth + itemHorizontalMargin * 2;

const entryBorderRadius = 8;

export default StyleSheet.create({
    slideInnerContainer: {
        width: itemWidth,
        height: slideHeight,
        paddingHorizontal: itemHorizontalMargin,
        paddingBottom: 10 // needed for shadow
    },
    shadow: {
        position: 'absolute',
        top: 0,
        left: itemHorizontalMargin,
        right: itemHorizontalMargin,
        bottom: 18,
        shadowColor: colors.black,
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 10,
        borderRadius: entryBorderRadius
    },
    imageContainer: {
        flex: 1,
        marginBottom: IS_IOS ? 0 : -1, // Prevent a random Android rendering issue
        backgroundColor: 'white',
        borderTopLeftRadius: entryBorderRadius,
        borderTopRightRadius: entryBorderRadius,
        borderBottomLeftRadius: entryBorderRadius,
        borderBottomRightRadius: entryBorderRadius
    },
    imageContainerEven: {
        backgroundColor: colors.black
    },
    image: {
        ...StyleSheet.absoluteFillObject,
        resizeMode: 'cover',
        borderRadius: IS_IOS ? entryBorderRadius : 0,
        borderTopLeftRadius: entryBorderRadius,
        borderTopRightRadius: entryBorderRadius,
        
    },
    textContainer: {
        position: 'absolute',
        justifyContent: 'center',
        padding: 13,
        backgroundColor: colors.black,
        bottom: 30,
        left: itemWidth/4,
        width: itemWidth/2,
        opacity: 0.8,
        borderTopLeftRadius: entryBorderRadius,
        borderTopRightRadius: entryBorderRadius,
        borderBottomLeftRadius: entryBorderRadius,
        borderBottomRightRadius: entryBorderRadius
    },
    title: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
        letterSpacing: 0.5,
        textAlign: 'left',
    },
    roomTextContainer: {
        justifyContent: 'center',
        paddingTop: 10 - entryBorderRadius,
        paddingBottom: 10,
        paddingHorizontal: 16,
        backgroundColor: 'white',
        borderBottomLeftRadius: entryBorderRadius,
        borderBottomRightRadius: entryBorderRadius
    },
    textContainerEven: {
        backgroundColor: colors.black
    },
    titleEven: {
        color: 'white'
    },
    topTextContainer: {
        position: 'absolute',
        justifyContent: 'center',
        padding: 8,
        backgroundColor: colors.black,
        bottom: itemHeight/4,
        left: itemWidth/4,
        width: itemWidth/2,
        opacity: 0.8,
        borderTopLeftRadius: entryBorderRadius,
        borderTopRightRadius: entryBorderRadius,
        borderBottomLeftRadius: entryBorderRadius,
        borderBottomRightRadius: entryBorderRadius
    }
});