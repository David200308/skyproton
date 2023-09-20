const db = require('../database/db');
const jwt = require('jsonwebtoken');

/*
    Verify the token Function
    @param token
    @return true or false
*/
function verifyToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                resolve(false);
            } else {
                decoded = JSON.parse(decoded);
                const email = decoded.email;
                const sessionKey = decoded.sessionKey;
                const LoginSQL = 'SELECT * FROM USER WHERE EMAIL = ? AND SESSIONKEY = ?';
                db.query(LoginSQL, [email, sessionKey], (err, result) => {
                    if (err) {
                        resolve(false);
                    } else if (result.length != 0) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                });
            }
        });
    });
}

module.exports = {
    verifyToken
}