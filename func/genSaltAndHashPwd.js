var crypto = require('crypto');

function genRandomString (length){
  return crypto.randomBytes(Math.ceil(length/2))
          .toString('hex')  /** convert to hexadecimal format */
          .slice(0,length)  /** return required number of characters */
}

function sha512(password, salt){
    let hash = crypto.createHmac('sha512', salt) /** Hashing algorithm sha512 */
    hash.update(password);
    let value = hash.digest('hex')
    return {
      salt:salt,
      pwd:value,
    }
};

function genSaltAndHashPwd(userpassword) {
    let salt = genRandomString(16)  /** Gives us salt of length 16 */
    return sha512(userpassword, salt)
}

if (require.main === module) {
  let pwd = process.argv[2]
  console.log(genSaltAndHashPwd(pwd))
} else {
  module.exports = genSaltAndHashPwd
}


