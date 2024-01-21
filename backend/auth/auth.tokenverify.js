const db = require('../database/db');
const jwt = require('jsonwebtoken');

/*
    Verify the token Function
    @param token
    @return true or false
*/
function verifyToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.jwtSecret, (err, decoded) => {
            console.log(err);
            if (err) {
                resolve(false);
            } else {
                const email = decoded.iss;
                if (decoded.aud === "google") {
                    const LoginSQL = 'SELECT * FROM USER WHERE EMAIL = ? AND CONNECTGOOGLE = ?';
                    db.query(LoginSQL, [email, true], (err, result) => {
                        if (result.length != 0) {
                            resolve(true);
                        } else {
                            resolve(false);
                        }
                    });
                } else {
                    const sessionKey = decoded.ver;
                    const LoginSQL = 'SELECT * FROM USER WHERE EMAIL = ? AND SESSIONKEY = ? AND UNIX_TIMESTAMP() < SESSIONKEYEXPIRETIME';
                    db.query(LoginSQL, [email, sessionKey], (err, result) => {
                        if (result.length != 0) {
                            resolve(true);
                        } else {
                            resolve(false);
                        }
                    });
                }
            }
        });
    });
}

module.exports = {
    verifyToken
}