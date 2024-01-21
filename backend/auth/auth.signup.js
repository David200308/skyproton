const db = require('../database/db');
const { isEmailExist } = require('./auth.accountexist');
const crypto = require('crypto');
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

      const emailDomains = ["connect.polyu.hk", "polyu.edu.hk"];
      
      if (!emailDomains.includes(email.split('@')[1])) {
          const response = {
            code: 400,
            status: false,
            message: 'Something went wrong, please try again.',
          };
          resolve(JSON.stringify(response));
      }
      if (email.split('@')[0] == "") {
        const response = {
          code: 400,
          status: false,
          message: 'Something went wrong, please try again.',
        };
        resolve(JSON.stringify(response));
      }
      if (
          email.includes('echo')
          || email.includes('print')
          || email.includes('system')
          || email.includes('exec')
          || email.includes('eval')
          || email.includes('passthru')
          || email.includes('shell_exec')
          || email.includes('phpinfo')
          || email.includes('base64')
          || email.includes('base64_decode')
          || email.includes('base64_encode')
          || email.includes('md5')
          || email.includes('sha1')
          || email.includes('str_rot13')
          || email.includes('convert_uu')
          || email.includes('$')
          || email.includes('[')
          || email.includes(']')
          || email.includes('{')
          || email.includes('}')
          || email.includes('"')
          || email.includes("'")
      ) {
        const response = {
          code: 400,
          status: false,
          message: 'Something went wrong, please try again.',
        };
        resolve(JSON.stringify(response));
      }

      db.connect(function (err) {
        if (err) throw err;
  
        isEmailExist(email)
          .then((emailExists) => {
            if (!emailExists) {
              const salt = sha256(email + Date.now() + crypto.randomBytes(64).toString("hex"));
              const passwordHash = sha256(password + salt);

              const AddSQL =
                'INSERT INTO USER (EMAIL, PASSWORD, SALT, CREATETIME) VALUES (?, ?, ?, UNIX_TIMESTAMP())';
              db.query(AddSQL, [email, passwordHash, salt], (err, result) => {
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