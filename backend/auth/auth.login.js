const db = require('../database/db');
const jwt = require('jsonwebtoken');
const sha256 = require('sha256');
const cypto = require('crypto');
const { updateSessionKey } = require('./auth.update');
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
        
        const getSaltSQL = 'SELECT SALT FROM USER WHERE EMAIL = ?';
        db.query(getSaltSQL, [email], (err, result) => {
            if (err) {
                const response = {
                    code: 400,
                    status: false,
                    message: 'Something went wrong, please try again.',
                };
                resolve(JSON.stringify(response));
            } else if (result.length != 0) {
                const salt = result[0].SALT;
                const passwordHash = sha256(password + salt);
                const LoginSQL = 'SELECT * FROM USER WHERE EMAIL = ? AND PASSWORD = ?';
                db.query(LoginSQL, [email, passwordHash], (err, result) => {            
                    if (err) {
                        const response = {
                            code: 400,
                            status: false,
                            message: 'Something went wrong, please try again.',
                        };
                        resolve(JSON.stringify(response));
                    } else if (result.length != 0) {
                        let sessionKey = "";
                        if ((Date.now() / 1000) < result[0].SESSIONKEYEXPIRETIME) {
                            sessionKey = result[0].SESSIONKEY;
                            // jwt payload - keep the same sessionKey
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
                            sessionKey = sha256(email + password + Date.now() + cypto.randomBytes(64).toString("hex"));

                            updateSessionKey(sessionKey, email).then((data) => {
                                if (data) {
                                    // console.log('SessionKey updated.');
                                    // jwt payload - update a new sessionKey
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
                        }
                        
                    } else if (result.length == 0){
                        const response = {
                            code: 400,
                            status: false,
                            message: 'Email or password is incorrect.',
                        };
                        resolve(response);
                    }
                });
            } else {
                const response = {
                    code: 400,
                    status: false,
                    message: 'Email is not found.',
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