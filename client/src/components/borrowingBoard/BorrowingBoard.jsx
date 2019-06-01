import Taro, { Component } from '@tarojs/taro'
import { View} from '@tarojs/components'

import Thumb from '../thumb/Thumb'

import './index.scss'

export default class BorrowingBoard extends Component {

  static options = {
    addGlobalClass: true
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  onClick = _id => {
    Taro.navigateTo({
      url: `../../pages/book/index?_id=${_id}`
    })
  }

  render () {
    const { status, title, author, cover, returnDate, bid } = this.props
    return (
      <View class='borrowing-board'>
        {
          status === 'loading' ? (
              <View class='borrowing-board-loading'>
                加载中...
              </View>
          ) : (
            status === 'success' ? (
              title ? (
                <Thumb 
                  cover={cover}
                  title={title}
                  author={author}
                  returnDate={returnDate.slice(0, 10)}
                  onClick={this.onClick.bind(this, bid)}
                />
              ) : (
                <View class='no-borrowing'>
                  还没借书, 赶紧去借吧
                </View>
              )
            ) : (
              <View>Error</View>
            )
          )
        }
      </View>
    )
  }
}
