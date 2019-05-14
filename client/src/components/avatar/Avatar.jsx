import Taro, { Component } from '@tarojs/taro'
import { View, Image, OpenData } from '@tarojs/components'

import './index.scss'
import logoSrc from '../../assert/logo.png'

export default class Avatar extends Component {
  
  componentWillMount () { }

  componentDidMount () { 

  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View class={this.props.class}>
        <View class='avatar-img'>
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
        <View class='username'>{this.props.name}</View>
      </View>
    )
  }
}
