import Taro, { Component } from '@tarojs/taro'
import { View, Image, OpenData } from '@tarojs/components'

import './index.scss'
import logoSrc from '../../assert/logo.png'

export default class Header extends Component {

  static options = {
    addGlobalClass: true
  }
  
  componentWillMount () { }

  componentDidMount () { 

  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  toLoginPage = () => {
    if (this.props.isVisitor) {
      let url = '../../pages/login/index'
      url += this.props._id ? `?id=${this.props._id}` : ''

      Taro.navigateTo({ url })
    }
  }

  render () {
    return (
      <View className='header-root header'>
        <View 
          className='avatar'
          onClick={this.toLoginPage}
        >
          {
            this.props.isAdmin ? (
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
          <View className='username'>{this.props.name}</View>
          { this.props._id && <View className='id'>{this.props._id}</View> }
          { this.props.isVisitor && <View className='tips'>点击头像登录</View> }
        </View>
        {this.props.children}
      </View>
    )
  }
}
