const fs = require('fs');
const csv = require('csv-parser');
const randomWords = require('random-words');

const users = [];

function generateUsername(firstname, surname) {
  return `${firstname[0]}-${surname}`.toLowerCase();
}

fs.createReadStream('input.csv')
  .pipe(csv())
  .on('data', function(row) {
    const username = generateUsername(row.Firstname, row.Surname);
    const password = randomWords(3).join('-');

    const user = {
      username,
      firstname: row.Firstname,
      surname: row.Surname,
      roles: row.Roles,
      password,
    };

    users.push(user);
  })
  .on('end', function() {
    console.table(users);
    writeToCSVFile(users);
  });

function writeToCSVFile(users) {
  const filename = 'output.csv';

  fs.writeFile(filename, extractAsCSV(users), err => {
    if (err) {
      console.log('Error writing to csv file', err);
    } else {
      console.log(`saved as ${filename}`);
    }
  });
}

function extractAsCSV(users) {
  const header = ['Username, Password, Roles'];
  const rows = users.map(
    user => `${user.username}, ${user.password}, ${user.roles}`
  );

  return header.concat(rows).join('\n');
}
