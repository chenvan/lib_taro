import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'

import classNames from 'classnames'

import './index.scss'

export default class Thumb extends Component {
  
  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  onClick = () => {
    this.props.onClick && this.props.onClick()
  }

  render () {
    let returnDateClass = 'return-date'
    if (this.props.returnDate) {
      let diff = Date.now() - Date.parse(this.props.returnDate)
      returnDateClass = classNames({
        'return-date': true,
        'return-date-outdated': diff > 24 * 60 * 60 * 1000,
        'return-date-now': diff > 0 && diff <= 24 * 60 * 60 * 1000
      })
    }

    return (
      <View
        class='thumb-root'
        onClick={this.onClick}
      >
        <View class='cover'>
          <Image 
            src={this.props.cover}
            mode='widthFix'
            class='cover_img'
            lazy-load
          />
        </View>
        <View class='other'>
          <View class='info'>
            <View class='title'>{this.props.title}</View>
            <View class='author'>{this.props.author}</View>
            { this.props.bookType && <View class='book-type'>{this.props.bookType}</View> }
            { this.props.returnDate && <View class={returnDateClass}>{this.props.returnDate}</View> }
          </View>
          { this.props.children }
        </View>
      </View>
    )
  }
}
