import Taro, { Component } from '@tarojs/taro'
import { View, Input} from '@tarojs/components'

import './index.scss'


export default class CustomInput extends Component {

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View class='input-root'>
        <Input 
          class='input'
        />
        <View class='bar'></View>
      </View>
    )
  }
}
