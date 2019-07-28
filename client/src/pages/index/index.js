/* eslint-disable taro/props-reserve-keyword */
import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx'

import Header from '../../components/header/Header'
import BorrowingBoard from '../../components/borrowingBoard/BorrowingBoard'
import CustomButton from '../../components/button/Button'

import keySrc from '../../assert/_ionicons_svg_md-key.svg'
import logoutSrc from '../../assert/_ionicons_svg_md-log-out.svg'
import heartSrc from '../../assert/_ionicons_svg_md-heart-empty.svg'
import searchSrc from '../../assert/_ionicons_svg_md-search.svg'
import scanSrc from '../../assert/_ionicons_svg_md-qr-scanner.svg'
import calendarSrc from '../../assert/_ionicons_svg_md-calendar.svg'

import './index.scss'

import env from '../../setting.js'

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
      loading: true
    }
    
  }

  componentDidMount () { 
    // let db_env = env.release
    if (process.env.NODE_ENV !== 'production') {
      // db_env = env.test
      // console.log('not production')
      
    }
    // console.log('env: ', db_env)

    // 本地初始化似乎不起作用
    Taro.cloud.init({
      env: env.test
    })

    this.init()
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  navigateTo = url => {
    Taro.navigateTo({
      url
    })
  }

  init = async () => {
    if(!this.props.user.name) {
      // if already login, no need to init 
      await this.props.user.init()
    }
    
    this.setState({
      loading: false
    })
  }

  actionFunc = name => {
    let funcList = {
      '收藏': this.navigateTo.bind(this, '../fav/index'),
      '搜索': this.navigateTo.bind(this, '../search/index'),
      '逾期名单': this.navigateTo.bind(this, '../outdated/index'),
      '退出登录': this.logout.bind(this),
      '更改密码': this.navigateTo.bind(this, '../login/index?isChangePWD=true')
    }
    return funcList[name]
  }

  logout = async () => {
    let { confirm } = await Taro.showModal({
      title: '提示',
      content: '确认退出?'
    })

    if (confirm) {
      await this.props.user.clearAll()
      Taro.redirectTo({url: '../login/index?action=redirect'})
    }
  }


  scan = async action => {
    let type = action === 'borrow' ? 'add' : 'del'
    let content = ''
    let title = ''

    try {
      let scanData = await Taro.scanCode({ 
          onlyFromCamera: true, 
          scanType: 'qrcode' 
        })

      Taro.showLoading({ title: '加载中... '})
      
      let keys = ['bid', 'uid', 'name', 'touser', 'formId']
      let values = scanData.result.split('|')
      let data = {}
      keys.forEach((key, i) => data[key] = values[i])

      let { result } = await Taro.cloud.callFunction({
          name: 'borrowing',
          data: { type, data }
        })

      title = result.msg ? '告知': '成功'
      content = result.msg || ( type === 'add' ? '借阅成功' : '还书成功' )
    } catch (err) {
      if (err.errMsg !== 'scanCode:fail cancel') {
        title = '出错'
        content = err.errMsg || err.message
      }
    }

    Taro.hideLoading()

    if (title) {
      Taro.showModal({title, content})
    }
  }

  onError = err => {
    console.log(err)
  }

  refresh = () => {
    Taro.eventCenter.trigger('getBorrowingInfo')
  }

  render () {
    return this.state.loading ? (
      <View>加载中...</View>
    ) : (
      <View class='root'>
        <Header 
          class='header'
          name={this.props.user.name}
          isAdmin={this.props.user.isAdmin}
          isVisitor={this.props.user.isVisitor}
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
              uid={this.props.user._id}
            />
          )
        }
        <View class='action-zone'>
          {
            this.actionList.map((actionName, index) => {
              return (
                <CustomButton
                  key={actionName}
                  onClick={this.actionFunc(actionName)}
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
