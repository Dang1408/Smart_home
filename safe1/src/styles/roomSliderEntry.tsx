import { Dimensions } from 'react-native';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');


function wp (percentage: number) {
    const value = (percentage * viewportWidth) / 100;
    return Math.round(value);
}

const slideWidth = wp(90);

export const sliderWidth = viewportWidth;
export const itemWidth = slideWidth;
export const sliderHeight = viewportHeight;
export const itemHeight = viewportHeight * 0.35;

