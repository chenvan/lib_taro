// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const _ = db.command

function getBookInfo (bid) {
  return db.collection('book').doc(bid).get()
    .then(res => {
      return [
        res.data.can_borrow_num > 0,
        {
          author: res.data.author,
          title: res.data.title,
          cover: res.data.cover
        }
      ]
    })
}

async function borrowBook (uid, bid, name, touser, formId) {

  let [ canBorrow, { author, title, cover } ] = await getBookInfo(bid)

  if (!canBorrow) throw Error(`${bookInfo.title}已经借完`)
  
  await db.collection('borrowing').add({
      data: {
        _id: uid,
        returnDate: db.serverDate({
          offset: 60 * 60 * 1000 * 24 * 7
        }),
        bid,
        name,
        title,
        author,
        cover,
      }
    })

  await db.collection('book').doc(bid).update({
      data: {
        can_borrow_num: _.inc(-1)
      }
    })
  
  await sendMessage(touser, formId, 'borrow', title)
  
  // return db.collection('borrowing').add({
  //   data: {
  //     _id: uid,
  //     returnDate: db.serverDate({
  //       offset: 60 * 60 * 1000 * 24 * 7
  //     }),
  //     bid,
  //     name,
  //     title,
  //     author,
  //     cover
  //   }}
  // ).then(res => {
  //   return db.collection('book').doc(bid).update({
  //     data: {
  //       can_borrow_num: _.inc(-1)
  //     }
  //   })
  // }).then(_ => {
  //   return sendMessage(touser, formId, 'borrow', title)
  // })
}

function getBorrowingBook (uid) {
  return db.collection('borrowing').doc(uid).get()
}


async function returnBook (uid, bid, touser, formId) {
  let { data } = await db.collection('borrowing').doc(uid).get()
  if (data.bid !== bid) throw Error(`借阅的书是${data.title}, 并不是这本`)

  await db.collection('borrowing').doc(uid).remove()

  await db.collection('book').doc(bid).update({
      data: {
        can_borrow_num: _.inc(1)
      }
    })

  await sendMessage(touser, formId, 'return', data.title)

  // return db.collection('borrowing').doc(uid).get()
  //   .then(res => {
  //     let resp = res.data.bid === bid ? 
  //       db.collection('borrowing').doc(uid).remove() : Promise.reject('没有借阅这本书, 归还失败') 
  //     return resp
  //   })
  //   .then(res => {
  //     return db.collection('book').doc(bid).update({
  //       data: {
  //         can_borrow_num: _.inc(1)
  //       }
  //     })
  //   })
  //   .then(_ => {
  //     return sendMessage(touser, formId, 'return', title)
  //   })
}

function sendMessage (touser, formId, type, title) {
  let { tempId, keyword2 } = type === 'return' ? {
    tempId: '0um16nwgvuB6hv3lJoZzyPNyNc3zxo6dmIpqKaHocrQ',
    keyword2: '继续去借书吧'
  } : {
    tempId: '1Q5BdS6eYVUb7PTTfmvDyDA8k-rX7usSLTdS2Tu9DhA',
    keyword2: '记得要在规定时间内还书哦'
  }
  return cloud.openapi.uniformMessage.send({
    touser,
    weappTemplateMsg: {
      page: 'pages/index/index',
      template_id: tempId,
      form_id: formId,
      data: {
        keyword1: {
          value: title
        },
        keyword2: {
          value: keyword2
        }
      },
      emphasis_keyword: 'keyword1.DATA'
    }
  })
}

function getOutdated (pageIndex, limit = 20) {
  return db.collection('borrowing')
    .where({
      returnDate: _.lt(db.serverDate())
    })
    .skip(pageIndex * limit)
    .limit(limit)
    .orderBy('returnDate', 'asc')
    .get()
}

// 云函数入口函数
exports.main = async (event, context) => {
  const { type, data } = event

  if (type === 'add') {
    return borrowBook(data.uid, data.bid, data.name, data.touser, data.formId)
  } else if (type === 'del') {
    return returnBook(data.uid, data.bid, data.touser, data.formId)
  } else if (type === 'get') {
    return getBorrowingBook(data.uid)
  } else if (type === 'outdated') {
    return getOutdated(data.pageIndex, data.limit)
  }
}