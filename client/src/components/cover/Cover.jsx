import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'

import './index.scss'

export default class Cover extends Component {
  render () {
    const {
      src,
      lazyLoad,
      width,
    } = this.props
    
    let widthSize = Taro.pxTransform(parseInt(width))
    let rootStyle = {
      width: widthSize
    }

    return (
      <View 
        className='cover-root'
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