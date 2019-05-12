import Taro, { Component } from '@tarojs/taro'
import { Provider } from '@tarojs/mobx'
import '@tarojs/async-await'

import Index from './pages/index'
import user from './store/user'

import './app.scss'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

const store = {
  user
}

class App extends Component {

  config = {
    pages: [
      'pages/index/index',
      'pages/login/index',
      'pages/search/index',
      'pages/book/index',
      'pages/fav/index',
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    },
    cloud: true
  }

  componentDidMount () {
    if (process.env.TARO_ENV === 'weapp') {
      Taro.cloud.init()
    }
  }

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
