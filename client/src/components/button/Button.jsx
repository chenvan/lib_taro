import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'

import './index.scss'

export default class CustomButton extends Component {
  static options = {
    addGlobalClass: true
  }

  onClick = () => {
    if (!this.props.disabled) {
      this.props.onClick && this.props.onClick()
    }
  }

  render () {
    return (
      <View 
        class={`button-root ${this.props.disabled ? 'button-root-disabled,' : ''} custom-button`}
        onClick={this.onClick}
      >
        { 
          this.props.src && (
            <Image
              class='button-icon'
              mode='widthFix'
              src={this.props.src}
              style={`width: ${this.props.iconWidth || '24px'}`}
            />
          )
        }
        {this.props.children}
      </View>
    )
  }
}
