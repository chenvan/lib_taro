import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx'
import './index.scss'

import Avatar from '../../components/avatar/Avatar'

@inject('user')
@observer
export default class Index extends Component {

  config = {
    navigationBarTitleText: '首页'
  }

  componentWillMount () { 
    const { user } = this.props
    console.log(user)
    if(user.isLoginDateOutdated()) {
      Taro.redirectTo({
        url: '../login/index'
      })
    }
  }

  componentDidMount () { 
    // page for dev
    // let devUrl = '../login/index'
    // Taro.navigateTo({
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

  logout = () => {
    this.props.user.clearAll()
    Taro.redirectTo({
      url: '../login/index'
    })
  }

  render () {
    return (
      <View class='root'>
        <View class='header'>
          <View class='avatar'>
            <Avatar 
              name={this.props.user.name}
              isAdmin={this.props.user.isAdmin}
            />
          </View>
          <View class='action-zone'>
            <View onClick={this.navigateTo.bind(this, '../fav/index')}>
              收藏
            </View>
            <View onClick={this.navigateTo.bind(this, '../search/index')} >
              搜索
            </View>
            <View onClick={this.logout}>
              退出登录
            </View>
            <View onClick={this.navigateTo.bind(this, '../login/index?isChangePWD=true')}>
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
