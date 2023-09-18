const db = require('../database/db');
const { isEmailExist } = require('./auth.accountexist');
const jwt = require('jsonwebtoken');
const sha256 = require('sha256');
require('dotenv').config();


/*
    Signup function
    @param email
    @param password
    @return response
*/
function signup(email, password) {
    return new Promise((resolve, reject) => {
      db.connect(function (err) {
        if (err) throw err;
  
        isEmailExist(email)
          .then((emailExists) => {
            if (!emailExists) {
              const AddSQL =
                'INSERT INTO USER (EMAIL, PASSWORD, CREATETIME) VALUES (?, ?, NOW())';
              db.query(AddSQL, [email, password], (err, result) => {
                if (err) {
                  console.log(err);
                  const response = {
                    code: 400,
                    status: false,
                    message: 'Something went wrong, please try again.',
                  };
                  resolve(JSON.stringify(response));
                } else {
                //   console.log(result);
                  const response = {
                    code: 200,
                    status: true,
                    message: 'Signup successful!',
                  };
                  resolve(response);
                }
              });
            } else {
              const response = {
                code: 400,
                status: false,
                message: 'Email already exists, please try another email.',
              };
              resolve(JSON.stringify(response));
            }
          })
          .catch((err) => {
            reject(err);
          });
      });
    });
}

module.exports = {
    isEmailExist, 
    signup,
}