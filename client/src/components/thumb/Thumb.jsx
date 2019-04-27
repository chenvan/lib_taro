import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'

import './index.scss'


export default class Thumb extends Component {
  // constructor (props) {
  //   super(props)
  //   this.state = {
  //   }
  // }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View class='thumb-root'>
        <View class='cover'>
          <Image 
            src={this.props.cover}
            mode='widthFix'
            class='cover_img'
            lazy-load
          />
        </View>
        <View class='info'>
          <View class='title'>{this.props.title}</View>
          <View class='author'>{this.props.author}</View>
          <View class='book-type'>{this.props.bookType}</View>
          { this.props.returnDate && <View>{this.props.returnDate}</View> }
        </View>
      </View>
    )
  }
}
