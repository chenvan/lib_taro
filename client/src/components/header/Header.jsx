/* eslint-disable taro/props-reserve-keyword */
import Taro, { Component } from '@tarojs/taro'
import { View, Image, OpenData } from '@tarojs/components'

import CustomButton from '../button/Button'

import './index.scss'
import logoSrc from '../../assert/logo.png'

export default class Header extends Component {
  
  componentWillMount () { }

  componentDidMount () { 

  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  refresh = () => {
    this.props.onRefresh && this.props.onRefresh()
  }

  render () {
    return (
      <View class={`header-root, ${this.props.class}`}>
        <View class='avatar'>
          {
            this.props.isAdmin ? (
              <Image 
                src={logoSrc}
                mode='widthFix'
                class='logo'
              />
            ) : (
              <OpenData 
                type='userAvatarUrl'
              />
            )
          }
        </View>
        <View class='user-info'>
          <View class='username'>{this.props.name}</View>
          <View class='id'>{this.props._id}</View>
        </View>
        {
          !this.props.isAdmin && (
            <View class='header-button-zone'>
              <CustomButton
                class='refresh-button'
                onClick={this.refresh}
              >
                刷新
              </CustomButton>
            </View>
          )
        }
      </View>
    )
  }
}
