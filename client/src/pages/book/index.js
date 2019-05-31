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
      bid: '',
      showState: 'none',
    }
  }

  componentWillMount () { }

  componentDidMount () {
    Taro.showLoading({
      title: '加载中...'
    })
    
    const getId = this.$router.params._id || '5cc15d291515aaa537798e04'

    this.setState({bid: getId})
    
    Taro.cloud.callFunction({
      name: "book",
      data: {
        type: 'get',
        data: {
          getId
        }
      }
    })
    .then(res => {
      this.onSuccess('book', res.result.data)
    })
    .catch(err => {
      this.onError('book', err)
    })
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  onSuccess = (from, data) => {
    Taro.hideLoading()
    if (from === 'book') {
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
        width: 150,
        height: 150,
        canvasId: 'qrcode',
        text: JSON.stringify({
          bid: this.state.bid,
          uid: this.props.user._id,
          name: this.props.user.name,
        })
      })
    } else if (from === 'fav') {
      Taro.showToast({
        title: '收藏成功'
      })
    }
  }

  onError =(from, err) => {
    Taro.hideLoading()

    if (from === 'book') {
      console.log(err)
      this.setState({
        status: 'error'
      })
    } else if (from === 'fav') {
      let { errMsg } = err

      // other method ??
      if (errMsg.includes('_fav_ dup key')) {
        errMsg = '已经收藏'
      } else if (errMsg.includes('超过收藏数')) {
        errMsg = '超过收藏数'
      }

      Taro.showModal({
        title: '出错',
        content: errMsg
      })
    }
  }

  showQrcode = () => {
    this.setState({
      showState: 'block'
    })
  }

  hideQrcode = () => {
    this.setState({
      showState: 'none'
    })
  }

  addToFav = () => {
    Taro.showLoading({
      title: '加载中...',
      mask: true
    })

    return Taro.cloud.callFunction({
      name: "fav",
      data: {
        type: 'add',
        data: {
          uid: this.props.user._id,
          bid: this.state.bid,
          title: this.state.title,
          author: this.state.author,
          cover: this.state.cover
        }
      }
    }).then(() => {
      this.onSuccess('fav')
    }).catch(err => {
      this.onError('fav', err)
    })
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
