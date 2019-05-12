import { observable } from 'mobx'
import Taro from '@tarojs/taro'

const user = observable({
  _id: Taro.getStorageSync('_id'),
  name: Taro.getStorageSync('name'),
  isAdmin: Taro.getStorageSync('isAdmin'),
  loginDate: Taro.getStorageSync('loginDate'), 
  set(data) {
    Object.keys(data).forEach(key => {
      this[key] = data[key]
      Taro.setStorageSync(key, data[key])
    })
  },
  clearAll() {
    ['_id', 'name', 'isAdmin', 'loginDate'].forEach(key => this[key] = undefined)
    Taro.clearStorageSync()
  },
  isLoginDateOutdated() {
    if (this.loginDate) {
      const MAX = 1000 * 60 * 60
      let currentDate = new Date()
      
      return currentDate - this.loginDate > MAX
    }
    return true
  }
})

export default user