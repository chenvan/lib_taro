import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

import classNames from 'classnames'

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
      isVisitor,
      opList = [],
    } = this.props

    const operationItemClass = classNames({
      'operation-item': true,
      'operation-item-disabled': isVisitor
    })

    return (
      <View className='operation-panel operation-panel-root'>
        <ColumnHeader title={title} />
        <View className='operation-container'>
          {
            opList.map(item => (
              <View 
                className={operationItemClass}
                key={item.title}
                onClick={() => !isVisitor && item.func()}
              >
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