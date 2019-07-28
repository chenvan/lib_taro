// 云函数入口文件
const cloud = require('wx-server-sdk')
const crypto = require('crypto')

cloud.init()

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

// 云函数入口函数
exports.main = async (event) => {
  const { ENV, OPENID } = cloud.getWXContext()
  const { type, data } = event

  cloud.updateConfig({
    env: ENV
  })

  const db = cloud.database()

  let { data: user } = await db.collection('user').doc(data._id).get()
  if (isPasswordValid(data.pwd, user.pwd, user.salt)) {
    let res
    if (type === 'login') {
      res = Promise.resolve({
        name: user.name,
        touser: OPENID,
      })
    } else if (type === 'changePWD') {
      let {salt, pwd} = saltHashPassword(data.newPWD)
      res = db.collection('user').doc(data._id).update({
        data: {
          salt,
          pwd
        }
      })
    }
    return res
  } else {
    return Promise.reject('密码错误')
  }
}