import Taro, { Component } from '@tarojs/taro'
import { View} from '@tarojs/components'

import Thumb from '../thumb/Thumb'

import './index.scss'

export default class BorrowingBoard extends Component {

  constructor (props) {
    super(props)

    this.state = {
      status: 'loading',
      bookInfo: {},
    }
  }

  componentWillMount () { }

  componentDidMount () { 
    this.getBorrowingInfo()
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  onClick = _id => {
    Taro.navigateTo({
      url: `../../pages/book/index?_id=${_id}`
    })
  }

  refresh = () => {
    this.setState({
      status: 'loading',
      bookInfo: {}
    })
    this.getBorrowingInfo()
  }

  getBorrowingInfo = () => {
    Taro.cloud.callFunction({
      name: 'borrowing',
      data: {
        type: 'get',
        data: {
          uid: this.props.uid
        }
      }
    }).then(res => {
      this.setState({
        status: 'success',
      })
      if (!res.result.msg) {
        this.setState({
          bookInfo: res.result.data
        })
      }
    }).catch(err => {
      this.setState({
        status: 'error'
      })
      console.log(err)
    })
  }

  render () {
    return (
      <View class={this.props.class}>
        {
          this.state.status === 'loading' ? (
              <View
                class='borrowing-board-loading'
              >
                加载中...
              </View>
          ) : (
            this.state.status === 'success' ? (
              this.state.bookInfo.title ? (
                <Thumb 
                  cover={this.state.bookInfo.cover}
                  title={this.state.bookInfo.title}
                  author={this.state.bookInfo.author}
                  returnDate={this.state.bookInfo.returnDate.slice(0, 10)}
                  onClick={this.onClick.bind(this, this.state.bookInfo.bid)}
                />
              ) : (
                <View
                  class='no-borrowing'
                >
                  还没借书, 赶紧去借吧
                </View>
              )
            ) : (
              <View>Error</View>
            )
          )
        }
        <View
          class='borrowing-board-refresh'
          onClick={this.refresh}
        >
          刷新
        </View>
      </View>
    )
  }
}
