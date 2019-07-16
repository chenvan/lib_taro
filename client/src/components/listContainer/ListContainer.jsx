import Taro, { Component } from '@tarojs/taro'
import { View} from '@tarojs/components'

import './index.scss'

export default class ListContainer extends Component {

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View 
        className='list-container'
      >
        {this.props.children}
        {
          this.props.hasMore === false && (
            <View class='footer'>
              NO MORE
            </View>
          )
        }
      </View>
    )
  }
}
