import Taro, { Component } from '@tarojs/taro'
import { View} from '@tarojs/components'

import './index.scss'

export default class ListContainer extends Component {

  render () {
    return (
      <View 
        className='list-container-root'
      >
        {this.props.children}
        {
          this.props.hasMore === false && (
            <View className='footer'>
              NO MORE
            </View>
          )
        }
      </View>
    )
  }
}
