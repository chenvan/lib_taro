/* eslint-disable taro/props-reserve-keyword */
import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx'
import './index.scss'

import Header from '../../components/header/Header'
import BorrowingBoard from '../../components/borrowingBoard/BorrowingBoard'
import CustomButton from '../../components/button/Button'

import keySrc from '../../assert/_ionicons_svg_md-key.svg'
import logoutSrc from '../../assert/_ionicons_svg_md-log-out.svg'
import heartSrc from '../../assert/_ionicons_svg_md-heart-empty.svg'
import searchSrc from '../../assert/_ionicons_svg_md-search.svg'
import scanSrc from '../../assert/_ionicons_svg_md-qr-scanner.svg'
import calendarSrc from '../../assert/_ionicons_svg_md-calendar.svg'

@inject('user')
@observer
export default class Index extends Component {

  config = {
    navigationBarTitleText: '首页'
  }

  constructor (props) {
    super(props)
    this.actionList = this.props.user.isAdmin ? ['逾期名单', '退出登录', '更改密码'] : ['收藏', '搜索', '退出登录', '更改密码'] 
    this.actionIcon = {
      '逾期名单': calendarSrc,
      '退出登录': logoutSrc,
      '更改密码': keySrc,
      '收藏': heartSrc,
      '搜索': searchSrc,
      '借书扫码': scanSrc,
      '还书扫码': scanSrc
    }

    this.disabledAction = ['更改密码', '收藏']
    
    this.state = {
      borrowingStatus: 'loading',
      borrowingTitle: undefined,
      borrowingAuthor: undefined,
      borrowingBid: undefined,
      borrowingCover: undefined,
      borrowingReturnDate: undefined
    }
  }
  
  
  componentWillMount () { 
    if(this.props.user.isLoginDateOutdated()) {
      Taro.redirectTo({
        url: '../login/index'
      })
    }
  }

  componentDidMount () { 
    // page for dev
    // let devUrl = '../outdated/index'
    // Taro.navigateTo({
    //   url: devUrl
    // })
    this.getBorrowingInfo()
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  navigateTo = url => {
    Taro.navigateTo({
      url
    })
  }

  actionFunc = name => {
    let list = {
      '收藏': this.navigateTo.bind(this, '../fav/index'),
      '搜索': this.navigateTo.bind(this, '../search/index'),
      '逾期名单': this.navigateTo.bind(this, '../outdated/index'),
      '退出登录': this.logout,
      '更改密码': this.navigateTo.bind(this, '../login/index?isChangePWD=true')
    }
    list[name]()
  }

  logout = () => {
    this.props.user.clearAll()
    Taro.redirectTo({
      url: '../login/index'
    })
  }


  scan = action => {
    let type = action === 'borrow' ? 'add' : 'del'

    Taro.scanCode({
      onlyFromCamera: true,
      scanType: 'qrcode'
    }).then(res => {
      Taro.showLoading({
        title: '加载中...'
      })

      return Taro.cloud.callFunction({
        name: 'borrowing',
        data: {
          type,
          data: JSON.parse(res.result)
        }
      })
    }).then(res => {
      
      let title = res.result.msg ? '告知' : '成功'
      let content = res.result.msg || ( type === 'add' ? '借阅成功' : '还书成功' )
      Taro.hideLoading()
      Taro.showModal({
        title,
        content,
      })
    }).catch(err => {
      Taro.hideLoading()
      if (err.errMsg !== 'scanCode:fail cancel') {
        let content = err.errMsg || err.message
        Taro.showModal({
          title: '出错',
          content,
        })
      }
    })
  }

  refresh = () => {
    this.setState({
      borrowingStatus: 'loading',
      borrowingTitle: undefined,
      borrowingAuthor: undefined,
      borrowingBid: undefined,
      borrowingCover: undefined,
      borrowingReturnDate: undefined
    })
    this.getBorrowingInfo()
  }

  getBorrowingInfo = () => {
    Taro.cloud.callFunction({
      name: 'borrowing',
      data: {
        type: 'get',
        data: {
          uid: this.props.user._id
        }
      }
    }).then(res => {
      let bookInfo = {}
      if (!res.result.msg) {
        bookInfo = res.result.data
      }

      this.setState({
        borrowingStatus: 'success',
        borrowingTitle: bookInfo.title,
        borrowingAuthor: bookInfo.author,
        borrowingBid: bookInfo.bid,
        borrowingCover: bookInfo.cover,
        borrowingReturnDate: bookInfo.returnDate
      })
      
    }).catch(err => {
      this.setState({
        borrowingStatus: 'error'
      })
      console.log(err)
    })
  }

  render () {
    return (
      <View class='root'>
        <Header 
          class='header'
          name={this.props.user.name}
          isAdmin={this.props.user.isAdmin}
          _id={this.props.user._id}
        >
          {
            !this.props.user.isAdmin && (
              <CustomButton
                class='custom-button'
                onClick={this.refresh}
                disabled={this.props.user.isVisitor}
              >
                刷新
              </CustomButton>
            )
          }
        </Header>
        {
          this.props.user.isAdmin ? (
            <View class='scan'>
              <CustomButton
                onClick={this.scan.bind(this, 'borrow')}
                src={this.actionIcon['借书扫码']}
              >
                <Text class='scan-borrow'>借书扫码</Text>
              </CustomButton>
              <CustomButton
                onClick={this.scan.bind(this, 'return')}
                src={this.actionIcon['还书扫码']}
              >
                <Text class='scan-return'>还书扫码</Text>
              </CustomButton>
            </View>
          ) : (
            <BorrowingBoard
              class='borrowing-board'
              status={this.state.borrowingStatus}
              title={this.state.borrowingTitle}
              author={this.state.borrowingAuthor}
              cover={this.state.borrowingCover}
              bid={this.state.borrowingBid}
              returnDate={this.state.borrowingReturnDate}
            />
          )
        }
        <View class='action-zone'>
          {
            this.actionList.map((actionName, index) => {
              return (
                <CustomButton
                  key={actionName}
                  onClick={this.actionFunc.bind(this, actionName)}
                  src={this.actionIcon[actionName]}
                  disabled={this.props.user.isVisitor && this.disabledAction.includes(actionName)}
                >
                  <Text 
                    class={index === 0 ? 'action-name-first' : 'action-name-others'}
                  >
                    {actionName}
                  </Text>
                </CustomButton>
              )
            })
          }
        </View>
      </View>
    )
  }
}
