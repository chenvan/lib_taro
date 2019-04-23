// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  // console.log(event)
  const { type, data } = event

  if (type === 'login') {
    return db.collection('user').doc(data._id).get()
      .then(res => {
        if (res.data.pwd === data.pwd) {
          return {
            name: res.data.name,
          }
        } else {
          return {
            error: 'pwd'
          }
        }
      })
      .catch(err => {
        if (err.errCode === -1) {
          return {
            error: '_id'
          }
        } else {
          throw err
        }
      })
  }
}