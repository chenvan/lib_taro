import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import './index.scss'

import Avatar from '../../components/avatar/Avatar'

export default class Index extends Component {

  config = {
    navigationBarTitleText: '首页'
  }

  componentWillMount () { }

  componentDidMount () { 
    // page for dev
    let devUrl = '../fav/index'
    Taro.navigateTo({
      url: devUrl
    })
  }

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
      <View class='root'>
        <View class='header'>
          <View class='avatar'>
            <Avatar />
          </View>
          <View class='action-zone'>
            <View onClick={this.navigateTo.bind(this, '../fav/index')}>
              收藏
            </View>
            <View onClick={this.navigateTo.bind(this, '../search/index')} >
              搜索
            </View>
            <View>
              退出登录
            </View>
            <View>
              更改密码
            </View>
          </View>
        </View>
        <View class='borrowing'>

        </View>
      </View>
    )
  }
}
