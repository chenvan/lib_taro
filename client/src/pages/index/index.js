import Taro, { Component } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import './index.scss'

// import Login from '../../components/login/index'

export default class Index extends Component {

  config = {
    navigationBarTitleText: '首页'
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  navigateTo = url => {
    Taro.navigateTo({
      url
    })
  }

  render () {
    return (
      <View>
        <Button onClick={this.navigateTo.bind(this, '../search/index')} >
          Search
        </Button>
        <Button onClick={this.navigateTo.bind(this, '../login/index')} >
          Login
        </Button>
      </View>
    )
  }
}
