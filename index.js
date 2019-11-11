const csv = require('csv-parser')
const fs = require('fs')
const randomWords = require('random-words')

const users = [];

function getUserName(data) {
    return (data.Firtname[0] + "-" + data.Surname).toLowerCase()
}

fs.createReadStream('input.csv')
  .pipe(csv())
  .on('data', function (data) {
    const userName = getUserName(data)
    
    let user = {
        username: userName,
        firstname: data.Firtname,
        surname: data.Surname,
      roles: data.Roles,
      password: randomWords(3).join('-')
    }

    users.push(user)
  })
  .on('end', function () {
      console.table(users)
      writeToCSV(users)
    })

function writeToCSV (data) {
    const filename = 'output.csv'

    fs.writeFileSync(filename,
      [['Username', 'Password', 'Roles']].concat(
        data.map(u => [u.username, u.password, u.roles].join(',')))
        .join('\n'))
    console.log(`saved as ${filename}`)
}