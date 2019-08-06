import Taro, { Component } from '@tarojs/taro'
import { Image } from '@tarojs/components'

// import classNames from 'classnames'

import './index.scss'

export default class WIcon extends Component {
  static options = {
    addGlobalClass: true
  }

  render () {
    const {
      src,
      iconSize = 24,
      // circle,
      // primary
    } = this.props

    // let iconClass = classNames({
    //   'w-icon-root': true,
    //   // 'w-icon-circle': circle,
    //   // 'w-icon-primary': primary
    // })

    let imgSize = Taro.pxTransform(parseInt(iconSize))
    // let paddingSize = Taro.pxTransform(parseInt(iconSize / 2))

    const iconStyle = {
      width: imgSize,
      height: imgSize,
    }

    // const rootStyle = {
    //   padding: paddingSize
    // }


    return (
      <Image
        className='w-icon w-icon-root'
        src={src}
        style={iconStyle}
      />
    )
  }
}