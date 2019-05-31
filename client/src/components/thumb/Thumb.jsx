import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'

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

  onDelete = e => {
    e.stopPropagation()

    if (this.props.onDelete) {
      Taro.showModal({
        title: this.props.title,
        content: '确认删除?'
      }).then(res => {
        if (res.confirm) {
          this.props.onDelete()
        }
      })
    }
  }

  render () {
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
            { this.props.returnDate && <View class='return-date'>{this.props.returnDate}</View> }
          </View>
          { 
            this.props.hasDeleteAction && (
              <View 
                onClick={this.onDelete}
                class='del-button'
              >
                删除
              </View>
            ) 
          }
        </View>
      </View>
    )
  }
}
