import React, { PureComponent } from 'react'
import { View, Text, Image, StyleSheet, Animated, ImageStyle, ViewStyle } from 'react-native'

type face = {
  id: number,
  imageUrl: string,
}

interface Props {
  imageStyle: ImageStyle | undefined,
  circleSize: number,
  face: face | undefined,
  offset: number,
}

class Circle extends PureComponent<Props> {
  render () {
    const { imageStyle, circleSize, face, offset } = this.props
    const innerCircleSize = circleSize * 2
    const marginRight = circleSize * offset

    return (
      <Animated.View
        style={{ marginRight: -marginRight }}
      >
        <Image
          style={[
            styles.circleImage,
            {
              width: innerCircleSize,
              height: innerCircleSize,
              borderRadius: circleSize
            },
            imageStyle
          ]}
          source={{uri: face?.imageUrl}}
        />
      </Animated.View>
    )
  }
}

export function renderFacePile (faces: Array<face> | undefined, numFaces: number) {
  if(typeof(faces) === 'undefined'){
    return {
      facesToRender: [],
      overflow: 0
    }
  }
  const entities = [...faces.reverse()]
  if (!entities.length) return {
    facesToRender: [],
    overflow: 0
  }

  const facesWithImageUrls = entities.filter((e: face) => e.imageUrl)
  if (!facesWithImageUrls.length) return {
    facesToRender: [],
    overflow: 0
  }

  const facesToRender = facesWithImageUrls.slice(0, numFaces)
  const overflow = entities.length - facesToRender.length

  return {
    facesToRender,
    overflow
  }
}

interface FacePileProps {
  faces: Array<face> | undefined,
  circleSize: number,
  hideOverflow?: boolean,
  containerStyle?: any,
  overflowStyle?: any,
  overflowLabelStyle?:any,
  imageStyle?: ImageStyle,
  circleStyle?: ViewStyle,
  render?: Function,
  numFaces: number,
  offset: number
}



export default class FacePile extends PureComponent<FacePileProps> {

  static defaultProps = {
    circleSize: 32,
    numFaces: 4,
    offset: 1,
    hideOverflow: false,
  }

  _renderOverflowCircle = (overflow: number) => {
    const {
      circleStyle,
      overflowStyle,
      overflowLabelStyle,
      circleSize,
      offset
    } = this.props
    
    const innerCircleSize = circleSize * 1.8
    const marginLeft = (circleSize * offset) - circleSize / 1.6

    return (
      <View
        style={circleStyle}
      >
        <View
          style={[
            styles.overflow,
            {
              width: innerCircleSize,
              height: innerCircleSize,
              borderRadius: circleSize,
              marginLeft: marginLeft
            },
            overflowStyle
          ]}
        >
          <Text
            style={[
              styles.overflowLabel,
              {
                fontSize: circleSize * 0.7
              },
              overflowLabelStyle
            ]}
          >
            +{overflow}
          </Text>
        </View>
      </View>
    )
  }

  _renderFace = (face: face, index: number) => {
    const { imageStyle, circleSize, offset } = this.props
    if (face && !face.imageUrl) return null

    return (
      <Circle
        key={face.id || index}
        face={face}
        imageStyle={imageStyle}
        circleSize={circleSize}
        offset={offset}
      />
    )
  }

  render () {
    const { render, faces, numFaces, hideOverflow, containerStyle } = this.props
    if (render) return render({ faces, numFaces })

    const { facesToRender, overflow } = renderFacePile(faces, numFaces)

    return (
      <View style={[styles.container, containerStyle]}>
        {overflow > 0 && !hideOverflow && this._renderOverflowCircle(overflow)}
        {Array.isArray(facesToRender) && facesToRender.map(this._renderFace)}
      </View>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row-reverse',
    flexWrap: 'nowrap',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  },
  circleImage: {
    borderWidth: 2,
    borderColor: 'white'
  },
  overflow: {
    backgroundColor: '#b6c0ca',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 18
  },
  overflowLabel: {
    color: '#fff',
    fontSize: 14,
    letterSpacing: -1,
    marginLeft: 3,
    fontWeight: 'bold'
  }
})
