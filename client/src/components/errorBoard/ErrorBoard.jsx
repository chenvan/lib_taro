import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'

import './index.scss'

export default class ErrorBoard extends Component {

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  onClick = () => {
    this.props.onClick && this.props.onClick()
  }

  render () {
    return (
      <View>
        <Text>有错误发生</Text>
        {
          this.props.onClick && (
            <Button onClick={this.onClick}>
              重试
            </Button>
          )}
      </View>
    )
  }
}
