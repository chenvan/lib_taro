import Taro, { Component } from '@tarojs/taro'
import { View} from '@tarojs/components'

import Thumb from '../thumb/Thumb'

import './index.scss'

export default class BorrowingBoard extends Component {

  constructor (props) {
    super(props)

    // this.state = {
    //   status: 'loading',
    //   bookInfo: {},
    // }
  }

  componentWillMount () { }

  componentDidMount () { 
    // this.getBorrowingInfo()
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  onClick = _id => {
    Taro.navigateTo({
      url: `../../pages/book/index?_id=${_id}`
    })
  }

  // refresh = () => {
  //   this.setState({
  //     status: 'loading',
  //     bookInfo: {}
  //   })
  //   this.getBorrowingInfo()
  // }

  // getBorrowingInfo = () => {
  //   Taro.cloud.callFunction({
  //     name: 'borrowing',
  //     data: {
  //       type: 'get',
  //       data: {
  //         uid: this.props.uid
  //       }
  //     }
  //   }).then(res => {
  //     this.setState({
  //       status: 'success',
  //     })
  //     if (!res.result.msg) {
  //       this.setState({
  //         bookInfo: res.result.data
  //       })
  //     }
  //   }).catch(err => {
  //     this.setState({
  //       status: 'error'
  //     })
  //     console.log(err)
  //   })
  // }

  render () {
    return (
      <View class={this.props.class}>
        {
          this.props.status === 'loading' ? (
              <View
                class='borrowing-board-loading'
              >
                加载中...
              </View>
          ) : (
            this.props.status === 'success' ? (
              this.props.bookInfo.title ? (
                <Thumb 
                  cover={this.props.bookInfo.cover}
                  title={this.props.bookInfo.title}
                  author={this.props.bookInfo.author}
                  returnDate={this.props.bookInfo.returnDate.slice(0, 10)}
                  onClick={this.onClick.bind(this, this.props.bookInfo.bid)}
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
      </View>
    )
  }
}
