const db = require('../../database/db');

/*
    Search teacher by name function
*/
function searchTeacherByName(name) {
    return new Promise((resolve, reject) => {
        db.connect(function (err) {
            if (err) throw err;
            const searchSQL = 'SELECT * FROM TEACHER WHERE NAME LIKE ? ORDER BY NAME ASC';
            db.query(searchSQL, '%' + name + '%', (err, result) => {
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
                        message: 'Search teacher successful!',
                        data: result
                    };
                    resolve(response);
                }
            });
        });
    });
}


/*
    Search teachers by department function
*/
function searchTeacherByDepartment(department) {
    return new Promise((resolve, reject) => {
        db.connect(function (err) {
            if (err) throw err;
            const searchSQL = 'SELECT * FROM TEACHER WHERE DEPARTMENT LIKE ? ORDER BY NAME ASC';
            db.query(searchSQL, '%' + department + '%', (err, result) => {
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
                        message: 'Search teacher successful!',
                        data: result
                    };
                    resolve(response);
                }
            });
        });
    });
}

// search all the teachers database by search keyword
function searchTeacherByKeyword(keyword) {
    return new Promise((resolve, reject) => {
        db.connect(function (err) {
            if (err) throw err;
            const searchSQL = 'SELECT * FROM TEACHER WHERE NAME LIKE ? OR DEPARTMENT LIKE ? OR TITLE LIKE ? OR OFFICELOCATION LIKE ? OR EMAIL LIKE ? ORDER BY NAME ASC';
            db.query(searchSQL, ['%' + keyword + '%', '%' + keyword + '%', '%' + keyword + '%', '%' + keyword + '%', '%' + keyword + '%'], (err, result) => {
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
                        message: 'Search teacher successful!',
                        data: result
                    };
                    resolve(response);
                }
            });
        });
    });
}


module.exports = {
    searchTeacherByName,
    searchTeacherByDepartment,
    searchTeacherByKeyword
}