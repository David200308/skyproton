const db = require('../../database/db');

/*
    Add teacher function
    @param: name, email, title, description, department
    @return: response
*/
const addTecher = (name, email, title, description, department) => {
    const addSQL = 'INSERT INTO TEACHER (NAME, EMAIL, TITLE, DESCRIPTION, DEPARTMENT, RECORDTIME) VALUES (?, ?, ?, ?, ?, NOW())';
    return new Promise((resolve, reject) => {
        db.connect(function (err) {
            if (err) throw err;
            db.query(addSQL, [name, email, title, description, department], (err, result) => {
                if (err) {
                    const response = {
                        code: 400,
                        status: false,
                        message: 'Something went wrong, please try again.',
                    };
                    resolve(JSON.stringify(response));
                } else {
                    const response = {
                        code: 200,
                        status: true,
                        message: 'Add teacher successful!',
                    };
                    resolve(response);
                }
            });
        });
    });
}

module.exports = {
    addTecher
}