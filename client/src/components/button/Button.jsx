import Taro, { Component } from '@tarojs/taro'
import { View, Image, Form, Button } from '@tarojs/components'

import classNames from 'classnames'

import './index.scss'

export default class CustomButton extends Component {
  static options = {
    addGlobalClass: true
  }

  onClick = e => {
    e.stopPropagation()
    if (!this.props.disabled) {
      this.props.onClick && this.props.onClick(e)
    }
  }

  render () {
    let btnClass = classNames({
      'custom-button-root': true,
      'custom-button': true,
      'custom-button-disabled': this.props.disabled
    })
    
    return (
      this.props.isCatchFormId ? (
        <View
          className={btnClass}
        >
          <Form
            reportSubmit
            onSubmit={this.onClick}
          >
            <Button 
              formType='submit'
              className='clear-button-style'
            >
              {this.props.children}
            </Button>
          </Form>
        </View>
      ) : (
        <View 
          className={btnClass}
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
    )
  }
}
