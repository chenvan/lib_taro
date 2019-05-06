// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  
  const { type, data } = event

  if (type === 'add') {
    return db.collection('fav').where({
      uid: data.uid
    })
      .get()
      .then(res => {
        if (res.data.length > 9) {
          throw Error('超过收藏数')
        }
        return db.collection('fav').add({
          data: {
            uid: data.uid,
            bid: data.bid,
            title: data.title,
            cover: data.cover,
            author: data.author,
            createTime: db.serverDate(),
          }
        })
      })
  } else if (type === 'remove') {
    return db.collection('fav').doc(data._id),remove()
  } else if (type === 'get') {
    return db.collection('fav').where({
      uid: data.uid
    })
      .orderBy('createTime', 'desc')
      .get()
  }
}