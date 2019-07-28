// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数

exports.main = async (event, context) => {
  const { ENV } = cloud.getWXContext()
  const { data, type } = event
  const limit = data.limit || 10

  cloud.updateConfig({
    env: ENV
  })

  const db = cloud.database()

  if (type === 'search') {
    let query = data.searchInfo === '' ? (
      db.collection('book')
    ) : (
      db.collection('book').where({
        [data.searchField]: db.RegExp({
          regexp: data.searchInfo,
          options: 'i'
        })
      })
    )
    
    return query.skip(data.pageIndex * limit)
      .limit(limit)
      .get()
  } else if (type === 'get') {
    return db.collection('book').doc(data.getId).get()
  }
}