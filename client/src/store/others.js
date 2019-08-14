import { observable, action } from 'mobx'
import Taro from '@tarojs/taro'

class Others {
  @observable typeList = process.env.NODE_ENV === 'production' ? [] : ['小说', '写真', '外国文学', '传记']

  @action.bound
  async initTypeList (getTypeList) {
    try {
      let [ typeListStorage, typeListLastUpdatedDateStorage] = await Promise.all([
        Taro.getStorage({key: 'typeList'}),
        Taro.getStorage({key: 'typeListLastUpdatedDate'})
      ])
      
      if (!this.istypeListLastUpdatedDateOutdated(typeListLastUpdatedDateStorage.data)) {
        this.typeList = typeListStorage.data
      } else {
        throw Error('outdated')
      }
    } catch(err) {
      try {
        let typeList = await getTypeList()
        this.typeList = typeList
        this.storageTypeList()
      } catch(nestedErr) {
        console.log(nestedErr)
      }
    }
  }

  @action
  async storageTypeList () {
    await Promise.all([
      Taro.setStorage({key: 'typeList', data: this.typeList}),
      Taro.setStorage({key: 'typeListLastUpdatedDate', data: new Date()})
    ])
  }

  @action
  istypeListLastUpdatedDateOutdated (lastDate) {
    if (lastDate) {
      const hour = 1000 * 60 * 60
      const MAX = process.env.NODE_ENV !== 'production' ? hour : 24 * 3 * hour
      let currentDate = new Date()
      return currentDate - lastDate > MAX
    }
    return true
  }
}

export default new Others()
