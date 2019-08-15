import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'

import './index.scss'

export default class PlaceHolder extends Component {
  static options = {
    addGlobalClass: true
  }


  render () {
    // const {
    //   minHeight = 100,
    // } = this.props

    return (
      <View className='placeholder-root placeholder'>
        <Image
          className='img'
          src={this.props.src}
          mode='widthFix' 
        />
        {this.props.children}
      </View>
    )
  }
}
