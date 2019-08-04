import Taro, { Component } from '@tarojs/taro'
import { View, Form, Button } from '@tarojs/components'

import classNames from 'classnames'

import WIcon from '../icon/Icon'

import './index.scss'

export default class WButton extends Component {
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
    let {
      primary,
      isCatchFormId,
      src,
      disabled,
      iconSize,
    } = this.props
    
    let btnClass = classNames({
      'w-button-root': true,
      'w-button': true, // at page can use w-button classname to custom WButton style
      'w-button-disabled': disabled,
      'w-button-primary': primary,
    })
    
    return (
      isCatchFormId ? (
        <View
          className={btnClass}
        >
          <Form
            reportSubmit
            onSubmit={this.onClick}
          >
            <Button 
              formType='submit'
              className='clear-default-button-style'
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
            src && (
              <WIcon 
                src={src}
                iconSize={iconSize}
              />
            )
          }
          <Button
            className='clear-default-button-style'
          >
            {this.props.children}
          </Button>
        </View>
      )
    )
  }
}
