import { observable } from 'mobx'
import Taro from '@tarojs/taro'

const user = observable({
  _id: Taro.getStorageSync('_id'),
  formId: Taro.getStorageSync('formId'),
  name: Taro.getStorageSync('name'),
  touser: Taro.getStorageSync('touser'),
  isAdmin: Taro.getStorageSync('isAdmin'),
  loginDate: Taro.getStorageSync('loginDate'), 
  isVisitor: Taro.getStorageSync('isVisitor'),
  set(data) {
    Object.keys(data).forEach(key => {
      this[key] = data[key]
      Taro.setStorageSync(key, data[key])
    })
  },
  clearAll() {
    Taro.clearStorage().then(() => {
      // clear isAdmin, scan zone will show BorrowingBoard Component
      // clear isVisitor, disabled button will change 
      ['_id', 'name', 'loginDate', 'touser', 'formId'].forEach(key => this[key] = undefined)
    })
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