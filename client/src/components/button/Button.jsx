import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'

import classNames from 'classnames'

import './index.scss'

export default class CustomButton extends Component {
  static options = {
    addGlobalClass: true
  }

  onClick = e => {
    e.stopPropagation()
    if (!this.props.disabled) {
      this.props.onClick && this.props.onClick()
    }
  }

  render () {
    let btnClass = classNames({
      'custom-button-root': true,
      'custom-button': true,
      'custom-button-disabled': this.props.disabled
    })
    
    return (
      <View 
        class={btnClass}
        onClick={this.onClick}
      >
        { 
          this.props.src && (
            <Image
              class='custom-button-icon'
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
