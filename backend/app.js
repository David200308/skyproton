const express = require('express');
const jwt = require('jsonwebtoken');

const { login } = require('./auth/auth.login');
const { signup } = require('./auth/auth.signup');

const addTeacher = require('./service/teacher/teacher.add');
const searchTeacher = require('./service/teacher/teacher.search');
const updateTeacher = require('./service/teacher/teacher.update');
const deleteTeacher = require('./service/teacher/teacher.delete');

const app = express();
const port = 5555;

app.use(express.json());


/*
    Welcome page
*/
app.get('/', (req, res) => {
    const response = {
        code: 200,
        status: true,
        message: 'Welcome to SkyProton API!'
    }
    res.send(response);
})

app.get('/auth', (req, res) => {
    const response = {
        code: 200,
        status: true,
        message: 'Welcome to SkyProton Auth API!'
    }
    res.send(response);
})

app.get('/service', (req, res) => {
    const response = {
        code: 200,
        status: true,
        message: 'Welcome to SkyProton Service API!'
    }
    res.send(response);
})


/*
    Login API endpoint
    POST /auth/login
    body: {
        email
        password
    }
    response: {
        code
        status
        message
        token (optional)
    }
*/
app.post('/auth/login', (req, res) => {
    if (req.body.email && req.body.password) {
        login(req.body.email, req.body.password)
            .then((data) => {
                if (data.token) {
                    res.cookie('token', data.token, { maxAge: 86400 });
                }
                const response = {
                    code: data.code,
                    status: data.status,
                    message: data.message,
                }
                res.send(response);
            })
            .catch((err) => {
                console.error('An error occurred:', err);
                const response = {
                    code: 400,
                    status: false,
                    message: 'An error occurred:', err
                }
                res.send(response);
            });
    } else {
        const response = {
            code: 400,
            status: false,
            message: 'Email and password are required.'
        }
        res.send(response);
    }
})


/*
    Signup API endpoint
    POST /auth/signup
    body: {
        email
        password
    }
    response: {
        code
        status
        message
    }
*/
app.post('/auth/signup', (req, res) => {
    if (req.body.email && req.body.password) {
        signup(req.body.email, req.body.password)
            .then((response) => {
                res.send(response);
            })
            .catch((err) => {
                console.error('An error occurred:', err);
                const response = {
                    code: 400,
                    status: false,
                    message: 'An error occurred:', err
                }
                res.send(response);
            });
    } else {
        const response = {
            code: 400,
            status: false,
            message: 'Email and password are required.'
        }
        res.send(response);
    }
})


/*
    Add Teacher API endpoint
    POST /service/teacher/add
    body: {
        name
        email
        title
        description
        department
    }
    response: {
        code
        status
        message
    }
*/
app.post('/service/teacher/add', (req, res) => {
    if (!req.body.name || !req.body.email || !req.body.title || !req.body.description || !req.body.department) {
        const response = {
            code: 400,
            status: false,
            message: 'Name, email, title, description and department are required.'
        }
        res.send(response);
    }

    addTeacher(req.body.name, req.body.email, req.body.title, req.body.description, req.body.department)
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            console.error('An error occurred:', err);
            const response = {
                code: 400,
                status: false,
                message: 'An error occurred:', err
            }
            res.send(response);
        });
})


app.listen(port, () => {
  console.log(`Auth API listening on port ${port}`);
})
