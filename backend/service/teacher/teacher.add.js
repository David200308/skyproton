const db = require('../../database/db');

/*
    Add teacher function
    @param: name, email, title, department, officeLocation
    @return: response
*/
function addTeacher(name, email, title, department, officeLocation) {
    const addSQL = 'INSERT INTO TEACHER (NAME, EMAIL, TITLE, DEPARTMENT, OFFICELOCATION, RECORDTIME) VALUES (?, ?, ?, ?, ?, NOW())';
    return new Promise((resolve, reject) => {
        db.connect(function (err) {
            if (err) throw err;
            db.query(addSQL, [name, email, title, department, officeLocation], (err, result) => {
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
    addTeacher
}