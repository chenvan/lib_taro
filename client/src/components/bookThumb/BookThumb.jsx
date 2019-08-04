import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

import Cover from '../cover/Cover'

import './index.scss'

export default class BookThumb extends Component {
  static options = {
    addGlobalClass: true
  }

  onClick = () => {
    this.props.onClick && this.props.onClick()
  }

  render () {
    return (
      <View 
        className='book-thumb-root book-thumb'
        onClick={this.onClick}
      >
        <Cover
          src={this.props.cover}
          lazyLoad
        />
        {this.props.title}
      </View>
    )
  }
}