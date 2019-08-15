import Taro, { Component } from '@tarojs/taro'
import { Image } from '@tarojs/components'

import './index.scss'

export default class WIcon extends Component {
  static options = {
    addGlobalClass: true
  }

  render () {
    const {
      src,
      iconSize = 24,
    } = this.props

    let imgSize = Taro.pxTransform(parseInt(iconSize))

    const iconStyle = {
      width: imgSize,
      height: imgSize,
    }

    return (
      <Image
        className='w-icon w-icon-root'
        src={src}
        style={iconStyle}
      />
    )
  }
}