// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
const db = cloud.database()

exports.main = async (event, context) => {
  const { data, type } = event

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
    
    return query.skip(data.skip)
      .limit(data.limit)
      .get()
  }
}