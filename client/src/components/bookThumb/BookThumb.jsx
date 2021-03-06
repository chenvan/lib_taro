import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

import Cover from '../cover/Cover'
import WButton from '../button/Button'

import './index.scss'

import delSrc  from '../../assert/_ionicons_svg_md-close-circle.svg'

export default class BookThumb extends Component {
  static options = {
    addGlobalClass: true
  }

  onClick = () => {
    
    this.props.onClick && !this.props.deletable && this.props.onClick()
  }

  render () {
    const { width, cover, deletable, title } = this.props

    const heightSize = parseInt(width) * 1.8
    const widthSize = parseInt(width)
    const fontSize = parseInt(width) / 8
    const rootStyle = {
      'min-height': Taro.pxTransform(heightSize),
      'font-size': Taro.pxTransform(fontSize),
      'max-width': Taro.pxTransform(widthSize),
    }

    return (
      
      <View 
        className='book-thumb-root book-thumb'
        onClick={this.onClick}
        style={rootStyle}
      >
        <Cover
          src={cover}
          width={width}
          lazyLoad
        />
        {!deletable && <Text>{title}</Text>}
        {
          deletable && (
            <WButton 
              onClick={this.props.onDelete} 
              src={delSrc} 
              iconSize={48}
            />
          )
        }
      </View>
    )
  }
}