import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

import './index.scss'

export default class WLoading extends Component {
  static options = {
    addGlobalClass: true
  }

  render () {
    const {
      loadingSize = 24,
      color = 'black',
    } = this.props

    let size = Taro.pxTransform(parseInt(loadingSize))
    let borderWidth = Taro.pxTransform(parseInt(loadingSize / 8))

    const sizeStyle = {
      width: size,
      height: size,
    }

    const colorStyle = {
      'border-width': borderWidth,
      'border-style': 'solid',
      'border-color': `${color} transparent transparent transparent`,
    }

    const ringStyle = Object.assign({}, colorStyle, sizeStyle)

    return (
      <View 
        className='w-loading-root w-loading'
        style={sizeStyle}
      >
        <View className='w-loading-ring' style={ringStyle}></View>
        <View className='w-loading-ring' style={ringStyle}></View>
        <View className='w-loading-ring' style={ringStyle}></View>
      </View>
    )
  }
}