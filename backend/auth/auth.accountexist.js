const db = require('../database/db');
const jwt = require('jsonwebtoken');
const sha256 = require('sha256');
require('dotenv').config();


/*
    Check if email exists
    @param email
    @return boolean
*/
const isEmailExist = (email) => {
    return new Promise((resolve, reject) => {
      db.connect(function (err) {
        if (err) throw err;
  
        const sql = 'SELECT COUNT(*) AS count FROM USER WHERE EMAIL = ?';
        db.query(sql, [email], (err, result) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                const count = result[0]['count'];
                if (count === 0) {
                //   console.log('Email does not exist');
                    resolve(false);
                } else if (count === 1) {
                //   console.log('Email exists');
                    resolve(true);
                }
            }
        });
      });
    });
};

module.exports = {
    isEmailExist
}