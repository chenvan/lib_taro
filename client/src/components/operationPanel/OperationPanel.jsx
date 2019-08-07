import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

import ColumnHeader from '../columnHeader/ColumnHeader'
import WIcon from '../icon/Icon'

import './index.scss'

export default class OperationPanel extends Component {
  static options = {
    addGlobalClass: true
  }

  render () {
    const {
      title,
      opList = [],
    } = this.props

    return (
      <View className='operation-panel operation-panel-root'>
        <ColumnHeader title={title} />
        <View className='operation-container'>
          {
            opList.map(item => (
              <View className='operation-item' key={item.title}>
                <WIcon 
                  src={item.iconSrc}
                  iconSize={64}
                />
                {item.title}
              </View>
            ))
          }
        </View>
      </View>
    )
  }
}