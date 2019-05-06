import Taro, { Component } from '@tarojs/taro'
import { View, Image, OpenData } from '@tarojs/components'

import './index.scss'
import logoSrc from '../../assert/logo.png'

export default class Avatar extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isAdmin: false,
      name: '陈旺',
    }
  }

  componentWillMount () { }

  componentDidMount () { 

  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View class='avatar-root'>
        <View class='avatar-img'>
          {
            this.state.isAdmin ? (
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
        <View class='username'>{this.state.name}</View>
      </View>
    )
  }
}
