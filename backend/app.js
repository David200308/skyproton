const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('./database/db');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { login } = require('./auth/auth.login');
const { signup } = require('./auth/auth.signup');
const { verifyToken } = require('./auth/auth.tokenverify');

const addTeacher = require('./service/teacher/teacher.add');
const { 
    searchTeacherByName, 
    searchTeacherByDepartment, 
    searchTeacherByKeyword 
} = require('./service/teacher/teacher.search');
const updateTeacher = require('./service/teacher/teacher.update');
const deleteTeacher = require('./service/teacher/teacher.delete');

const app = express();
const port = 5555;

app.use(express.json());

app.use(session({
    secret: process.env.jwtSecret,
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5555/auth/google/callback",
  },
  function(accessToken, refreshToken, profile, done) {
    const userEmail = profile.emails[0].value;
    
    db.query('SELECT * FROM USER WHERE EMAIL = ?', [userEmail], (err, results) => {
      if (err) return done(err);
      if (results.length > 0) {
        const user = results[0];
        if (!user.CONNECTGOOGLE) {
            db.query('UPDATE USER SET CONNECTGOOGLE = ?, WHERE EMAIL = ?', [true, userEmail], (err, result) => {
                if (err) return done(err);
                user.CONNECTGOOGLE = true;
          });
        } else {
          return done(null, user);
        }
      } else {
        
        const newUser = {
          EMAIL: userEmail,
          CREATETIME: Math.floor(Date.now() / 1000),
          CONNECTGOOGLE: true,
        };

        db.query('INSERT INTO USER SET ?', newUser, (err, result) => {
          if (err) return done(err);
          return done(null, newUser);
        });
      }
    });
  }
));


passport.serializeUser(function(user, done) {
    done(null, user.EMAIL);
});

passport.deserializeUser(function(email, done) {
    db.query('SELECT * FROM USER WHERE EMAIL = ?', [email], (err, results) => {
        if (err) { 
          done(err); 
        } else {
          done(null, results[0]);
        }
      });
});

// Google Authentication Routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }),
    function(req, res) {
        const email = req.user.EMAIL;
        
        const payload = {
            exp: Math.floor(Date.now() / 1000) + 86400,
            iss: email,
            aud: 'google'
        }
        
        const token = jwt.sign(payload, process.env.jwtSecret, { algorithm: 'HS256' }, {
            expiresIn: 86400,
        });

        res.cookie('token', token, { maxAge: 86400 * 1000 });
        res.redirect('/');
    }
);


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
    or
    cookie: {
        token
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
                    res.cookie('token', data.token, { maxAge: 86400 * 1000 });
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
    } else if (req.cookies.token) {
        verifyToken(req.cookies.token)
            .then((data) => {
                if (data === true) {
                    const response = {
                        code: 200,
                        status: true,
                        message: 'Token is valid.',
                    }
                    res.send(response);
                } else {
                    const response = {
                        code: 400,
                        status: false,
                        message: 'Token is invalid.',
                    }
                    res.send(response);
                }
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
        department
        officeLocation
    }
    response: {
        code
        status
        message
    }
*/
app.post('/service/teacher/add', (req, res) => {
    if (!req.body.name || !req.body.email || !req.body.title || !req.body.department || !req.body.officeLocation) {
        const response = {
            code: 400,
            status: false,
            message: 'Name, email, title, department, and officeLocation are required.'
        }
        res.send(response);
    }

    addTeacher(req.body.name, req.body.email, req.body.title, req.body.department, req.body.officeLocation)
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


/*
    Search Teacher by name || department || keyword API endpoint
    GET /service/teacher/search?name= || department= || keyword=
    @param name || department || keyword
    return response
*/
app.get('/service/teacher/search', (req, res) => {
    const name = req.query.name;
    const department = req.query.department;
    const keyword = req.query.keyword;

    if (name) {
        searchTeacherByName(name)
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
    } else if (department) {
        searchTeacherByDepartment(department)
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
    } else {
        searchTeacherByKeyword(keyword)
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
    }
});


app.listen(port, () => {
  console.log(`Auth API listening on port ${port}`);
})
