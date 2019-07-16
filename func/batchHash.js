// _id
// name
// pwd
// salt
const csv = require('fast-csv')
const genSaltAndHashPwd = require('./genSaltAndHashPwd.js')
const headers = require('./setting.js')

let sourceAddress = process.argv[2]
let targetAddress = process.argv[3]

let rowsToWrite = []

csv.parseFile(sourceAddress, { headers: true })
  .transform(data => {
    let result = genSaltAndHashPwd(data[headers.password]) 
    return {
      _id: data[headers.id],
      name: data[headers.name],
      pwd: result.pwd,
      salt: result.salt,
    }
  })
  .on('error', err => console.log('read err: ', err))
  .on('data', row => {
    rowsToWrite.push(row)
  })
  .on('end', () => {
    csv.writeToPath(targetAddress, rowsToWrite, { headers: true })
      .on('error', err => console.log('write err: ', err))
      .on('finish', () => console.log('Done!!!'))
  })
