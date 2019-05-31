import Taro, { Component } from '@tarojs/taro'
import { View} from '@tarojs/components'

import './index.scss'

export default class ErrorBoard extends Component {

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View class={this.props.class}>
        {this.props.error}
      </View>
    )
  }
}
