import { observable, action, runInAction } from 'mobx'
import Taro from '@tarojs/taro'

class User {
  @observable _id = undefined
  @observable formId = undefined
  @observable name = undefined
  @observable touser = undefined
  @observable isAdmin = undefined
  @observable loginDate = undefined
  @observable isVisitor = undefined

  @action
  async init () {
    let keys = ['_id', 'formId', 'name', 'touser', 'isAdmin', 'isVisitor', 'loginDate']
    try {
      let dataList = await Promise.all(
        keys.map(key => Taro.getStorage({ key }))
      )

      // console.log(dataList)

      runInAction(() => {
        keys.forEach((key, index) => {
          this[key] = dataList[index].data
        })
      })
    } catch (err) {
      console.log('user init:', err)
    }
  }

  @action
  async set (data) {
    let saveList = Object.keys(data).reduce((list, key) => {
      this[key] = data[key]
      list.push(Taro.setStorage({ key, data: data[key] }))
      return list
    }, [])

    try {
      await Promise.all(saveList)
    } catch (err) {
      console.log(err)
    }
  }

  @action
  async clearAll () {
    let keys = ['_id', 'name', 'loginDate', 'touser', 'formId']
    // Taro.showLoading()
    try {
      await Taro.clearStorage()
      keys.forEach(key => this[key] = undefined)
    } catch(err) {
      console.log(err)
    }
    // Taro.hideLoading()
  }

  @action.bound
  isLoginDateOutdated () {
    if (this.loginDate) {
      const MAX = 1000 * 60 * 60
      let currentDate = new Date()
      
      return currentDate - this.loginDate > MAX
    }
    return true
  }
}


export default new User()
