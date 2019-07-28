// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

function getBookInfo (db, bid) {
  return db.collection('book').doc(bid).get()
    .then(({data: bookInfo}) => {
      return [
        bookInfo.can_borrow_num > 0,
        {
          author: bookInfo.author,
          title: bookInfo.title,
          cover: bookInfo.cover
        }
      ]
    })
}

async function borrowBook (db, uid, bid, name, touser, formId) {

  let [ canBorrow, { author, title, cover } ] = await getBookInfo(db, bid)

  if (!canBorrow) return Promise.reject(`${bookInfo.title}已经借完`)
  
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
        can_borrow_num: db.command.inc(-1)
      }
    })
  
  await sendMessage(touser, formId, 'borrow', title)
}

function getBorrowingBook (db, uid) {
  return db.collection('borrowing').doc(uid).get()
}


async function returnBook (db, uid, bid, touser, formId) {
  let { data: bookInfo } = await db.collection('borrowing').doc(uid).get()
  if (bookInfo.bid !== bid) return Promise.reject(`借阅的书是${bookInfo.title}, 并不是这本`)

  await db.collection('borrowing').doc(uid).remove()

  await db.collection('book').doc(bid).update({
      data: {
        can_borrow_num: db.command.inc(1)
      }
    })

  await sendMessage(touser, formId, 'return', bookInfo.title)
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

function getOutdated (db, pageIndex, limit = 20) {
  return db.collection('borrowing')
    .where({
      returnDate: db.command.lt(db.serverDate())
    })
    .skip(pageIndex * limit)
    .limit(limit)
    .orderBy('returnDate', 'asc')
    .get()
}

// 云函数入口函数
exports.main = async (event) => {
  const { ENV } = cloud.getWXContext()
  const { type, data } = event

  cloud.updateConfig({
    env: ENV
  })

  const db = cloud.database()

  if (type === 'add') {
    return borrowBook(db, data.uid, data.bid, data.name, data.touser, data.formId)
  } else if (type === 'del') {
    return returnBook(db, data.uid, data.bid, data.touser, data.formId)
  } else if (type === 'get') {
    return getBorrowingBook(db, data.uid)
  } else if (type === 'outdated') {
    return getOutdated(db, data.pageIndex, data.limit)
  }
}