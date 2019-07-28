import { observable, action, runInAction } from 'mobx'
import Taro from '@tarojs/taro'

class User {
  @observable _id = undefined
  @observable name = undefined
  @observable touser = undefined
  @observable isAdmin = undefined
  @observable loginDate = undefined
  @observable isVisitor = undefined

  @action.bound
  async init () {
    let keys = ['_id', 'name', 'touser', 'isAdmin', 'loginDate']
    try {
      
      let dataList = await Promise.all(
        keys.map(key => Taro.getStorage({ key }))
      )

      // console.log(dataList)
      // keys.forEach((key, index) => {
      //   this[key] = dataList[index].data
      // })

      // this.isVisitor = this.isLoginDateOutdated()
      // 为什么要使用 runInAction
      runInAction(() => {
        keys.forEach((key, index) => {
          this[key] = dataList[index].data
        })
        this.isVisitor = this.isLoginDateOutdated()
      })
    } catch (err) {
      // 如果没有登录历史, 则设为visitor
      this.loginAsVisitor()
      // await this.set({
      //   '_id': '',
      //   'name': '游客',
      //   'touser': '',
      //   'isVisitor': true,
      //   'isAdmin': false,
      //   'loginDate': new Date()
      // })
      // console.log('user init:', err)
    }
  }

  @action.bound
  async loginAsVisitor () {
    let visitor = {
      '_id': null,
      'name': '游客',
      'touser': '',
      'isVisitor': true,
      'isAdmin': false,
      'loginDate': new Date()
    }

    Object.keys(visitor).forEach(key => {
      this[key] = visitor[key]
    })
  }

  @action
  async set (data) {
    //
    let saveList = Object.keys(data).reduce((list, key) => {
      this[key] = data[key]

      if (key !== 'isVisitor') {
        list.push(Taro.setStorage({ key, data: data[key] }))
      }

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
    // let keys = ['_id', 'name', 'loginDate', 'touser']
    // Taro.showLoading()
    try {
      await Taro.clearStorage()


      this.loginAsVisitor()
      // keys.forEach(key => this[key] = undefined)
    } catch(err) {
      console.log(err)
    }
    // Taro.hideLoading()
  }

  @action.bound
  isLoginDateOutdated () {
    if (this.loginDate) {
      const hour = 1000 * 60 * 60
      const MAX = process.env.NODE_ENV !== 'production' ? hour : 24 * 3 * hour
      
      let currentDate = new Date()
      
      return currentDate - this.loginDate > MAX
    }
    return true
  }
}


export default new User()
