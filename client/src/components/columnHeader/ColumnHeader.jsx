import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

import './index.scss'

export default class ColumnHeader extends Component {
  static options = {
    addGlobalClass: true
  }
  
  render () {
    
    return (
      <View className='column-header-root column-header'>
        <View className='column-title'>{this.props.title}</View>
        {this.props.children}
      </View>
    )
  }
}