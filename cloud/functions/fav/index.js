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
    let { data: favList } = await db.collection('fav').where({ uid: data.uid }).get()
    
    if (favList.length > 9) return Promise.reject('超过收藏数')

    let record = {
      uid: data.uid,
      bid: data.bid,
      title: data.title,
      cover: data.cover,
      author: data.author,
      createTime: db.serverDate(),
    }

    return db.collection('fav').add({ data: record })
  } else if (type === 'remove') {
    return db.collection('fav').doc(data._id).remove()
  } else if (type === 'get') {
    return db.collection('fav').where({ uid: data.uid })
      .orderBy('createTime', 'desc')
      .get()
  }
}