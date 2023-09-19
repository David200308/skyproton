const db = require('../../database/db');

/*
    Search teacher by name function
    @param name
    return response
*/
function searchTeacherByName(name) {
    return new Promise((resolve, reject) => {
        db.connect(function (err) {
            if (err) throw err;
            const searchSQL = 'SELECT * FROM TEACHER WHERE NAME LIKE' + '"%' + name + '%"' + 'ORDER BY NAME ASC';
            db.query(searchSQL, (err, result) => {
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
    @param department
    return response
*/
function searchTeacherByDepartment(department) {
    return new Promise((resolve, reject) => {
        db.connect(function (err) {
            if (err) throw err;
            const searchSQL = 'SELECT * FROM TEACHER WHERE DEPARTMENT LIKE' + '"%' + department + '%"' + 'ORDER BY NAME ASC';
            db.query(searchSQL, (err, result) => {
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
    Search teachers by keyword function
    @param keyword
    return response
*/
function searchTeacherByKeyword(keyword) {
    return new Promise((resolve, reject) => {
        db.connect(function (err) {
            if (err) throw err;
            const searchSQL = 'SELECT * FROM TEACHER WHERE NAME LIKE' + '"%' + keyword + '%"' + 'OR DEPARTMENT LIKE' + '"%' + keyword + '%"' + 'OR TITLE LIKE' + '"%' + keyword + '%"' + 'OR OFFICELOCATION LIKE' + '"%' + keyword + '%"' + 'OR EMAIL LIKE' + '"%' + keyword + '%"' + 'ORDER BY NAME ASC';
            db.query(searchSQL, (err, result) => {
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