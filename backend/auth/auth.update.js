const db = require('../database/db');

/*
    Update user SessionKey function
    @param sessionKey
    @return true or false
*/
function updateSessionKey(sessionKey, email) {
    return new Promise((resolve, reject) => {
        db.connect(function (err) {
            if (err) throw err;

            const LoginSQL = 'UPDATE USER SET SESSIONKEY = ? WHERE EMAIL = ?';
            db.query(LoginSQL, [sessionKey, email], (err, result) => {            
                if (err) {
                    resolve(false);
                } else if (result.length != 0) {
                    resolve(true);
                }
            });
        });
    });
}

module.exports = {
    updateSessionKey
}