import Taro, { Component } from '@tarojs/taro'
import { View} from '@tarojs/components'

import Thumb from '../thumb/Thumb'

import './index.scss'

export default class BorrowingBoard extends Component {

  static options = {
    addGlobalClass: true
  }

  constructor (props) {
    super(props)
    this.state = {
      status: 'loading',
      title: '',
      author: '',
      cover: '',
      bid: '',
      returnDate: '',
    }
  }

  componentDidMount () { 
    this.init()
  }

  onClick = _id => {
    Taro.navigateTo({
      url: `../../pages/book/index?_id=${_id}`
    })
  }

  init = async () => {
    await this.getBorrowingInfo()
    Taro.eventCenter.on('getBorrowingInfo', this.getBorrowingInfo)
  }

  getBorrowingInfo = async () => {
    let uid = this.props.uid
    let info = {}

    try {
      if (this.state.status !== 'loading') this.setState({ status: 'loading' })

      let { result } = await Taro.cloud.callFunction({ 
                                name: 'borrowing', 
                                data: { type: 'get', data: { uid } } 
                              })
      
      info = result.data
      info.status = 'success'

    } catch (err) {
      // err we should handle
      if (err.message && err.message.includes(`${uid} does not exist`)) {
        info.status = 'success'
      } else {
        // err we do not handle
        info.status = 'fail'
      }
    }

    this.setState({
      status: info.status,
      title: info.title,
      author: info.author,
      cover: info.cover,
      returnDate: info.returnDate,
      bid: info.bid,
    })
  }

  render () {
    const { status, title, author, cover, returnDate, bid } = this.state
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
