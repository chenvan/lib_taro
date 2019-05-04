import Taro, { Component } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import './index.scss'

export default class Index extends Component {

  config = {
    navigationBarTitleText: '首页'
  }

  componentWillMount () { }

  componentDidMount () { 
    // page for dev
    // let devUrl = '../book/index'
    // Taro.redirectTo({
    //   url: devUrl
    // })
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
          <View>头像</View>
          <View class='action-zone'>
            <View>
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
