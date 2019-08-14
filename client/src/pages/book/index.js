import Taro, { Component } from '@tarojs/taro'
import { View, Canvas, Icon } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx'
import drawQrcode from 'weapp-qrcode'

import WButton from '../../components/button/Button'
import Cover from '../../components/cover/Cover'

import closeSrc from '../../assert/_ionicons_svg_md-close-circle.svg'
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
      type: '',
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
      console.log('data: ', data)
      let { author, type, can_borrow_num, cover, isbn, master, summary, title, total_num } = data

     
      this.setState({
        status: 'success',
        author,
        type,
        can_borrow_num,
        cover,
        isbn,
        master,
        summary,
        title,
        total_num,
      })

    } else if (from === 'fav') {
      this.props.user.toggleIsFavListChanged(true)
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

  showQrcode = async event => {
    Taro.showLoading({title: '加载中...'})
    // const { screenWidth } = await Taro.getSystemInfo();
    // const scale = screenWidth / 375;
    let { _id, name, touser } = this.props.user
    let formId = event.detail.formId 


    drawQrcode({
      width: 200,
      height: 200,
      canvasId: 'qrcode',
      text: [this.bid, _id, name, touser, formId].join('|')
    })

    Taro.hideLoading()
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
    const {
      user
    } = this.props


    return (
      this.state.status !== 'loading' && (
        this.state.status === 'success' ? (
          <View className='root'>
            <View className='book-root'>
              <View className='title'>
                {this.state.title}
              </View>
              <View className='info'>
                <Cover 
                  src={this.state.cover}
                  width={250}
                />
                <View className='others'>
                  <View className='child-info'>{'作者: ' + this.state.author}</View>
                  {this.state.master !== '' && <View className='child-info'>{'书主: ' + this.state.master}</View>}
                  <View className='child-info'>{'类型: ' + this.state.type}</View>
                  <View className='child-info'>{'ISBN: ' + this.state.isbn}</View>
                  <View className='child-info'>{'总数: ' + this.state.total_num}</View>
                  <View className='child-info'>{'可借: ' + this.state.can_borrow_num}</View>
                </View>
              </View>
              <View className='btn-zone'>
                <WButton 
                  onClick={this.addToFav}
                  disabled={user.isVisitor}
                >
                  收藏
                </WButton>
                <WButton 
                  onClick={this.showQrcode}
                  disabled={user.isVisitor}
                  isCatchFormId
                >
                  二维码
                </WButton>
              </View>
              <View className='summary'>
                <View>内容简介</View>
                <View>{this.state.summary}</View>
              </View>
            </View>
            <View 
              className='modal-root'
              style={`display: ${this.state.showState}`} 
            >
              <View className='content-root'>
                <View className='qrcode-root'>
                  <Canvas className='qrcode' canvasId='qrcode' />
                </View>
                <WButton
                  onClick={this.hideQrcode}
                  src={closeSrc}
                  iconSize={80}
                />
                {/* <View className='hide-button'>
                  <Icon 
                    onClick={this.hideQrcode} 
                    type='clear'
                    size='36'
                  />
                </View> */}
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
