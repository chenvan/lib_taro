import Taro, { Component } from '@tarojs/taro'
import { View, Image, OpenData } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx'
import WButton from '../button/Button'

import './index.scss'

import logoSrc from '../../assert/logo.png'
import keySrc from '../../assert/_ionicons_svg_md-key.svg'
import logoutSrc from '../../assert/_ionicons_svg_md-log-out.svg'

@inject('user')
@observer
export default class Profile extends Component {

  static options = {
    addGlobalClass: true
  }

  toLoginPage = () => {
    let url = '../../pages/login/index'
    url += this.props.user._id ? `?_id=${this.props.user._id}` : ''
    
    Taro.navigateTo({ url })
  }

  logout = async () => {
    let { confirm } = await Taro.showModal({
      title: '提示',
      content: '确认退出?'
    })

    if (confirm) {
      await this.props.user.clearAll()
      Taro.redirectTo({url: '../../pages/login/index?action=redirect'})
    }
  }

  changePassword = () => {
    Taro.navigateTo({url: '../../pages/login/index?isChangePWD=true'})
  }

  render () {
    const { user } = this.props
    return (
      <View className='profile-root profile'>
        <View 
          className='avatar'
        >
          {
            user.isAdmin ? (
              <Image 
                src={logoSrc}
                mode='widthFix'
                className='logo'
              />
            ) : (
              <OpenData 
                type='userAvatarUrl'
              />
            )
          }
        </View>
        <View className='user-info'>
          <View className='username'>{user.name}</View>
          { user._id && <View className='id'>{user._id}</View> }
          { (user._id && user.isVisitor) && <View className='tips'>超期,请重新登录</View> }
        </View>
        <View className='user-button'>
          { 
            user.isVisitor ? (
              <WButton
                onClick={this.toLoginPage}
                src={logoutSrc}
                iconSize={36}
                primary
              >
                登录
              </WButton>
            ) : (
              <WButton
                onClick={this.logout}
                src={logoutSrc}
                iconSize={36}
                primary
              />
            )
          }
          {
            !user.isVisitor && (
              <WButton
                onClick={this.changePassword}
                src={keySrc}
                iconSize={36}
                circle
                primary
              />
            )
          }
        </View>
      </View>
    )
  }
}
