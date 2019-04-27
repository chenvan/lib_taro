import Taro, { Component } from '@tarojs/taro'
import { View, Image, Canvas } from '@tarojs/components'
import drawQrcode from 'weapp-qrcode'
import './index.scss'

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
      this.onSuccess(res.result.data)
    })
    .catch(err => {
      this.onError(err)
    })
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  onSuccess = data => {
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
        uid: '001960'
      })
    })

    Taro.hideLoading()
  }

  onError = err => {
    console.log(err)
    this.setState({
      status: 'error'
    })
    Taro.hideLoading()
  }

  showQrcode = () => {
    
  }

  render () {
    return (
      <View>
        {
          this.state.status !== 'loading' && (
            this.state.status === 'success' ? (
              <View class='root'>
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
                  <View class='button'>收藏</View>
                  <View class='button'>二维码</View>
                </View>
                <View class='summary'>
                  <View>内容简介</View>
                  <View>{this.state.summary}</View>
                </View>
                <View class='qrcode-root'>
                  <Canvas class='qrcode' canvasId='qrcode' />
                </View>
              </View>
            ) : (
              <View>
                Error
              </View>
            )
          )
        }
      </View>
    )
  }
}
