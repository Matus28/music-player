'use strict'

const mysql = require('mysql');
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'mediaPlayer'
});

function query(sqlQuery, arrayValues) {
  return new Promise((resolve, reject) => {
    conn.query(sqlQuery, arrayValues, (err, rows) => {
      if(err) {
        console.log(err);
        reject('DATABASE ERROR!');
        return;
      }
      return resolve(rows);
    });
  });
}

module.exports = query;