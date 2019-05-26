import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'

import './index.scss'

export default class CustomButton extends Component {

  onClick = () => {
    this.props.onClick && this.props.onClick()
  }

  render () {
    return (
      <View 
        class={`button-root, ${this.props.class}`}
        onClick={this.onClick}
      >
        { 
          this.props.src && (
            <Image
              class='button-icon'
              mode='widthFix'
              src={this.props.src}
            />
          )
        }
        {this.props.children}
      </View>
    )
  }
}
