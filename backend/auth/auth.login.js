const db = require('../database/db');
const jwt = require('jsonwebtoken');
const sha256 = require('sha256');
require('dotenv').config();


/*
    Login function
    @param email
    @param password
    @return response
*/
function login(email, password) {
    return new Promise((resolve, reject) => {
      db.connect(function (err) {
        if (err) throw err;
  
        const LoginSQL = 'SELECT * FROM USER WHERE EMAIL = ? AND PASSWORD = ?';
        db.query(LoginSQL, [email, password], (err, result) => {            
            if (err) {
                const response = {
                    code: 400,
                    status: false,
                    message: 'Something went wrong, please try again.',
                };
                resolve(JSON.stringify(response));
            } else if (result.length != 0) {
                const sessionKey = sha256(email + password + Date.now() + Math.random());
                updateSessionKey(sessionKey, email).then((data) => {
                    if (data) {
                        // jwt payload
                        const payload = {
                            exp: Math.floor(Date.now() / 1000) + 86400,
                            iss: email,
                            ver: sessionKey
                        }

                        const token = jwt.sign(payload, process.env.jwtSecret, { algorithm: 'HS256' }, {
                            expiresIn: 86400,
                        });

                        const response = {
                            code: 200,
                            status: true,
                            message: 'Login successful!',
                            token: token,
                        };
                        resolve(response);
                    } else {
                        console.log('SessionKey update failed.');
                    }
                });
                
            } else if (result.length == 0){
                const response = {
                    code: 400,
                    status: false,
                    message: 'Email or password is incorrect.',
                };
                resolve(response);
            }
        });
      });
    });
}

module.exports = {
    login
}