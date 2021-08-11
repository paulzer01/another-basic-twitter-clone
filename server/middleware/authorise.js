const jwt = require('jsonwebtoken');
require('dotenv').config();

// 

function authorise(req, res, next) {
    // get token from header
    const token = req.header('token');

    // check if the token exists
    if (!token) {
        return res.status(403).json("Authorisation denied");
    }

    // verify token
    try {
        // gives the decoded payload i.e. user: {id: user_id}
        const payload = jwt.verify(token, process.env.jwtSecret);

        // req.user is needed for the dashboard routes to return user_id
        req.user = payload.user;
        next();
    } catch (err) {
        res.status(401).json("Token is not valid");
    }
}

module.exports = authorise;