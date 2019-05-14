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

  constructor (props) {
    super(props)

    this.actionList = this.props.user.isAdmin ? ['逾期名单', '退出登录', '更改密码'] : ['收藏', '搜索', '退出登录', '更改密码'] 
  }
  
  
  componentWillMount () { 
    if(this.props.user.isLoginDateOutdated()) {
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

  actionFunc = name => {
    let list = {
      '收藏': this.navigateTo.bind(this, '../fav/index'),
      '搜索': this.navigateTo.bind(this, '../search/index'),
      '逾期名单': () => {console.log('逾期名单')},
      '退出登录': this.logout,
      '更改密码': this.navigateTo.bind(this, '../login/index?isChangePWD=true')
    }
    list[name]()
  }

  logout = () => {
    this.props.user.clearAll()
    Taro.redirectTo({
      url: '../login/index'
    })
  }

  scanToBorrow = () => {
    Taro.scanCode({
      onlyFromCamera: true,
      scanType: 'qrcode'
    }).then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    })
  }

  scanToReturn = () => {

  }

  render () {
    return (
      <View class='root'>
        <View class='header'>
          <Avatar
            class='avatar'
            name={this.props.user.name}
            isAdmin={this.props.user.isAdmin}
          />
        </View>
        <View class='action-zone'>
          {
            this.actionList.map(actionName => {
              return (
                <View class='action-button' key={actionName} onClick={this.actionFunc.bind(this, actionName)}>
                  {actionName}
                </View>
              )
            })
          }
        </View>
        {
          this.props.user.isAdmin ? (
            <View class='scan'>
              <View 
                class='scan-borrow'
                onClick={this.scanToBorrow}
              >
                借书扫码
              </View>
              <View class='scan-return'>
                还书扫码
              </View>
            </View>
          ) : (
            <View class='borrowing'>
              Borrowing
            </View>
          )
        }
      </View>
    )
  }
}
