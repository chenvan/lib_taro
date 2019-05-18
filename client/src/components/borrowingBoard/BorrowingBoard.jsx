import Taro, { Component } from '@tarojs/taro'
import { View} from '@tarojs/components'

import './index.scss'


export default class BorrowingBoard extends Component {

  componentWillMount () { }

  componentDidMount () { 
    Taro.cloud.callFunction({
      name: 'borrowing',
      data: {
        type: 'get',
        data: {
          uid: this.props.uid
        }
      }
    }).then(res => {
      
      console.log(res)
    }).catch(err => {

      console.log(err)
    })
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View>
        Borrowing
      </View>
    )
  }
}
