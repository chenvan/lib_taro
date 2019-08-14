import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'

import './index.scss'

export default class Cover extends Component {
  static options = {
    addGlobalClass: true
  }

  render () {
    const {
      src,
      lazyLoad,
      width,
    } = this.props
    
    let rootStyle = {}
    if (width) {
      let widthSize = Taro.pxTransform(parseInt(width))
      rootStyle = {
        width: widthSize
      }
    }
    
    return (
      <View 
        className='cover-root cover'
        style={rootStyle}
      >
        <Image
          className='cover-img'
          src={src}
          lazyLoad={lazyLoad}
          mode='widthFix'
        />
      </View>
    )
  }
}