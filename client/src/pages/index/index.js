/* eslint-disable taro/props-reserve-keyword */
import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx'

import Profile from '../../components/profile/Profile'
import BorrowingInfo from '../../components/borrowInfo/BorrowInfo'
import FavInfo from '../../components/favInfo/FavInfo'
import WButton from '../../components/button/Button'
import WIcon from '../../components/icon/Icon'

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
    this.actionList = this.props.user.isAdmin ? ['逾期名单'] : ['收藏', '搜索'] 
    this.actionIcon = {
      '逾期名单': calendarSrc,
      // '退出登录': logoutSrc,
      // '更改密码': keySrc,
      // '收藏': heartSrc,
      '搜索': searchSrc,
      '借书扫码': scanSrc,
      '还书扫码': scanSrc
    }
    this.disabledAction = ['收藏']

    this.state = {
      loading: true
    }
    
  }

  componentDidMount () { 
    let using_env = env.release
    if (process.env.NODE_ENV !== 'production') {
      using_env = env.test
      console.log('not production')
    }
    // console.log('env: ', using_env)

    Taro.cloud.init({
      env: using_env
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
      // '退出登录': this.logout.bind(this),
      // '更改密码': this.navigateTo.bind(this, '../login/index?isChangePWD=true')
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


  render () {
    const {
      user
    } = this.props

    return this.state.loading ? (
      <View>加载中...</View>
    ) : (
      <View class='root'>
        <Profile 
          class='profile'
        />
        {
          user.isAdmin && (
            <View class='scan'>
              <WButton
                onClick={this.scan.bind(this, 'borrow')}
                src={this.actionIcon['借书扫码']}
                iconSize='36'
              >
                <Text class='scan-borrow'>借书扫码</Text>
              </WButton>
              <WButton
                onClick={this.scan.bind(this, 'return')}
                src={this.actionIcon['还书扫码']}
              >
                <Text class='scan-return'>还书扫码</Text>
              </WButton>
            </View>
          )
        }
        {
          !user.isAdmin && (
            <View className='column-list'>
              <BorrowingInfo
                uid={user._id}
              />
              <FavInfo />
              <View className='search-column'>
                <View 
                  className='search-box'
                  onClick={() => this.navigateTo('../search/index')}
                >
                  <WIcon 
                    src={searchSrc}
                    iconSize={32}
                  />
                  { ' 书名 | 作者' }
                </View>
                <WButton>
                  搜索类型
                </WButton>
              </View>
            </View>
          )
        }
      </View>
    )
  }
}
