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

function borrowBook (uid, bid, name, touser, formId, title, author, cover) {
  return db.collection('borrowing').add(
    {
      data: {
        _id: uid,
        returnDate: db.serverDate({
          offset: 60 * 60 * 1000 * 24 * 7
        }),
        bid,
        name,
        title,
        author,
        cover
      }
    }
  ).then(res => {
    return db.collection('book').doc(bid).update({
      data: {
        can_borrow_num: _.inc(-1)
      }
    })
  }).catch(err => {
    if (typeof err.errMsg === 'string' && err.errMsg.includes('_id_ dup')) {
      return {
        msg: '借书人借书额度已用完'
      }
    } else {
      throw Error(err)
    }
  }).then(() => {
    return sendMessage(touser, formId, 'borrow', title)
  })
}

function getBorrowingBook (uid) {
  return db.collection('borrowing').doc(uid).get()
    .catch(err => {
      if (typeof err.errMsg === 'string' && err.errMsg.includes(`document with _id ${uid} does not exist`)) {
        return {
          msg: '没有借阅'
        }
      } else {
        throw Error(err)
      }
    })
}


function returnBook (uid, bid, touser, formId) {
  return db.collection('borrowing').doc(uid).get()
    .then(res => {
      if (res.data.bid === bid) {
        return db.collection('borrowing').doc(uid).remove()
          .then(res => {
            return db.collection('book').doc(bid).update({
              data: {
                can_borrow_num: _.inc(1)
              }
            }).then(() => {
              return sendMessage(touser, formId, 'return')
            })
          })
      } else {
        return {
          msg: '没有借阅这本书, 归还失败'
        }
      }
    }).catch(err => {
      if (typeof err.errMsg === 'string' && err.errMsg.includes(`document with _id ${uid} does not exist`)) {
        return {
          msg: '没有借阅这本书, 归还失败'
        }
      } else {
        throw Error(err)
      }
    })
}

function sendMessage (touser, formId, type, title) {
  let message = type === 'return' ? '还书成功' : `${title}借阅成功`
  let date = new Date()
  return cloud.openapi.uniformMessage.send({
    touser,
    weappTemplateMsg: {
      page: 'pages/index/index',
      template_id: 'bwuK96l6H5PzsQifkTRuUqquZLFMkkzMljJ4JeUryiI',
      form_id: formId,
      data: {
        keyword1: {
          value: message
        },
        keyword2: {
          value: date.toDateString()
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
    return getBookInfo(data.bid).then(([isCanBorrow, bookInfo]) => {
      if (isCanBorrow) {
        return borrowBook(data.uid, data.bid, data.name, data.touser, data.formId, bookInfo.title, bookInfo.author, bookInfo.cover)
      } else {
        return {
          msg: `${bookInfo.title}已经借完`
        }
      }
    })
    
  } else if (type === 'del') {
    return returnBook(data.uid, data.bid, data.touser, data.formId)
  } else if (type === 'get') {
    return getBorrowingBook(data.uid)
  } else if (type === 'outdated') {
    return getOutdated(data.pageIndex, data.limit)
  }
}