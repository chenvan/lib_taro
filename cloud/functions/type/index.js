// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event) => {

  const { ENV } = cloud.getWXContext()
  const { type, data } = event

  cloud.updateConfig({
    env: ENV
  })

  const db = cloud.database()

  if (type === 'add') {
    // 待增加 
  } else if (type === 'remove') {
    // 待增加
  } else if (type === 'get') {
    return db.collection('type').get()
  }
}