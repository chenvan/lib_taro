/* eslint-disable taro/props-reserve-keyword */
import Taro, { Component } from '@tarojs/taro'
import { View, Image, Canvas, Icon } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx'
import drawQrcode from 'weapp-qrcode'

import CustomButton from '../../components/button/Button'

import './index.scss'

@inject('user')
@observer
export default class Index extends Component {

  config = {
    navigationBarTitleText: '书籍信息'
  }

  constructor(props) {
    super(props)
    this.state = {
      status: 'loading',
      author: '',
      book_type: '',
      can_borrow_num: 0,
      cover: '',
      isbn: '',
      master: '',
      summary: '',
      title: '',
      total_num: 0,
      showState: 'none',
    }
  }

  componentWillMount () { }

  componentDidMount () {
    this.init()
  }

  init = async () => {
    this.bid = this.$router.params._id || '5cc15d291515aaa537798e04' // the last one for dev

    Taro.showLoading({ title: '加载中...'})
    
    try {
      let { result } = await Taro.cloud.callFunction({
          name: 'book',
          data: { type: 'get', data: { getId: this.bid } }
        })
      
      this.onSuccess('book', result.data)
    } catch (err) {
      this.onError('book', err)
    }
  }

  onSuccess = (from, data) => {
    Taro.hideLoading()
    if (from === 'book') {
      // console.log('data: ', data)
      let { author, book_type, can_borrow_num, cover, isbn, master, summary, title, total_num } = data
     
      this.setState({
        status: 'success',
        author,
        book_type,
        can_borrow_num,
        cover,
        isbn,
        master,
        summary,
        title,
        total_num,
      })

      drawQrcode({
        width: 200,
        height: 200,
        canvasId: 'qrcode',
        // 是否需要这么多数据 ???
        text: JSON.stringify({
          bid: this.bid,
          uid: this.props.user._id,
          name: this.props.user.name,
          title: title,
          touser: this.props.user.touser,
          formId: this.props.user.formId, // 换一种方式获取 ?
        })
      })
    } else if (from === 'fav') {
      Taro.showToast({ title: '收藏成功' })
    }
  }

  onError = (from, err) => {
    Taro.hideLoading()

    if (from === 'book') {
      console.log(err)
      this.setState({ status: 'error' })
    } else if (from === 'fav') {
      // 有问题
      console.log(err)
      let msg = err.errMsg || err.message

      // other method ??
      if (msg && msg.includes('_fav_ dup key')) {
        msg = '已经收藏'
      } else if (msg && msg.includes('超过收藏数')) {
        // 
        msg = '超过收藏数'
      }

      Taro.showModal({
        title: '出错',
        content: msg
      })
    }
  }

  showQrcode = () => {
    this.setState({ showState: 'block' })
  }

  hideQrcode = () => {
    this.setState({ showState: 'none' })
  }

  addToFav = async () => {
    Taro.showLoading({
      title: '加载中...',
      mask: true
    })

    try {
      await Taro.cloud.callFunction({
          name: "fav",
          data: {
            type: 'add',
            data: {
              uid: this.props.user._id,
              bid: this.bid,
              title: this.state.title,
              author: this.state.author,
              cover: this.state.cover
            }
          }
      })
      this.onSuccess('fav')
    } catch (err) {
      this.onError('fav', err)
    }
  }

  render () {
    return (
      this.state.status !== 'loading' && (
        this.state.status === 'success' ? (
          <View class='root'>
            <View class='book-root'>
              <View class='title'>
                {this.state.title}
              </View>
              <View class='info'>
                <View class='cover'>
                  <Image 
                    src={this.state.cover}
                    mode='widthFix'
                    class='img'
                  />
                </View>
                <View class='others'>
                  <View class='item'>{'作者: ' + this.state.author}</View>
                  {this.state.master !== '' && <View class='item'>{'书主: ' + this.state.master}</View>}
                  <View class='item'>{'类型: ' + this.state.book_type}</View>
                  <View class='item'>{'ISBN: ' + this.state.isbn}</View>
                  <View class='item'>{'总数: ' + this.state.total_num}</View>
                  <View class='item'>{'可借: ' + this.state.can_borrow_num}</View>
                </View>
              </View>
              <View class='action'>
                <CustomButton 
                  class='custom-button' 
                  onClick={this.addToFav}
                  disabled={this.props.user.isVisitor}
                >
                  收藏
                </CustomButton>
                <CustomButton 
                  class='custom-button' 
                  onClick={this.showQrcode}
                  disabled={this.props.user.isVisitor}
                >
                  二维码
                </CustomButton>
              </View>
              <View class='summary'>
                <View>内容简介</View>
                <View>{this.state.summary}</View>
              </View>
            </View>
            <View 
              class='modal-root'
              style={`display: ${this.state.showState}`} 
            >
              <View class='qrcode-root'>
                <Canvas class='qrcode' canvasId='qrcode' />
                <View class='hide-button'>
                  <Icon 
                    onClick={this.hideQrcode} 
                    type='clear'
                    size='36'
                  />
                </View>
              </View>
            </View>
          </View>
        ) : (
          <View>
            Error
          </View>
        )
      )
    )
  }
}
