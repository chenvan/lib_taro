import { observable } from 'mobx'
import Taro from '@tarojs/taro'

const user = observable({
  _id: Taro.getStorageSync('_id'),
  name: Taro.getStorageSync('name'),
  isAdmin: Taro.getStorageSync('isAdmin'),
  loginDate: Taro.getStorageSync('loginDate'), //需要用 new Date 变回 Date Object 吗?
  set(data) {
    Object.keys(data).forEach(key => {
      this[key] = data[key]
      Taro.setStorageSync(key, data[key])
    })
  },
  clearAll() {
    Object.keys(this).forEach(key => this[key] = undefined)
    Taro.clearStorageSync()
  },
  isLoginDateOutdated() {
    let currentDate = new Date()
    console.log(currentDate)
    console.log(this.loginDate)
  }
})

export default user