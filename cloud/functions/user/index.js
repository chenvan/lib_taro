// 云函数入口文件
const cloud = require('wx-server-sdk')
const crypto = require('crypto')

cloud.init()

const db = cloud.database()

function genRandomString (length){
  return crypto.randomBytes(Math.ceil(length/2))
    .toString('hex') /** convert to hexadecimal format */
    .slice(0,length);   /** return required number of characters */
}

function sha512 (password, salt){
  var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
  hash.update(password);
  var value = hash.digest('hex');
  return {
      salt:salt,
      pwd:value
  };
};

function saltHashPassword (userpassword) {
  var salt = genRandomString(16); /** Gives us salt of length 16 */
  return sha512(userpassword, salt)
}

function isPasswordValid (password, hashPassword, salt) {
  return sha512(password, salt).pwd === hashPassword
}

function findUser (uid) {
  return db.collection('user').doc(uid).get()
}

function changePassword (uid, newPassword) {
  let {salt, pwd} = saltHashPassword(newPassword)
  return db.collection('user').doc(uid).update({
    data: {
      salt,
      pwd
    }
  })
}

function handleLoginError (err) {
  if (err.errCode === -1) {
    return {
      error: 'cloud _id'
    }
  } else {
    throw err
  }
}

// 云函数入口函数
exports.main = async (event, context) => {
  // console.log(event)
  const { type, data } = event

  if (type === 'login') {
    return findUser(data._id)
      .then(res => {
        if (isPasswordValid(data.pwd, res.data.pwd, res.data.salt)) {
          return {
            name: res.data.name,
            touser: cloud.getWXContext().OPENID
          }
        } else {
          return { error: 'cloud pwd'}
        }
      })
      .catch(err => handleLoginError(err))
  } else if (type === 'changePWD') {
    return findUser(data._id)
      .then(res => {
        if (isPasswordValid(data.pwd, res.data.pwd, res.data.salt)) {
          return changePassword(data._id, data.newPWD)
        } else {
          return { error: 'cloud pwd'} 
        }
      })
  }
}