const db = require('../database/db');
const { isEmailExist } = require('./auth.accountexist');
const jwt = require('jsonwebtoken');
const sha256 = require('sha256');
require('dotenv').config();

/*
    Protect Login function
    @param accessToken
    @return response
*/
const protect = (accessToken) => {
    if (accessToken) {
        try {
            let authorization = accessToken.split(' ');
            if (authorization[0] !== 'Bearer') {
                return res.status(401).send();
            } else {
                req.jwt = jwt.verify(authorization[1], process.env.jwtSecret);
                return next();
            }
        } catch (err) {
            return res.status(403).send();
        }
    } else {
        return res.status(401).send();
    }
};


module.exports = {
    protect
}