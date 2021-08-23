const router = require('express').Router();
const bcrypt = require('bcrypt');
const pool = require('../db');
const jwtGenerator = require('../utils/jwtGenerator');
const authorise = require('../middleware/authorise');

// register a new user and generate a jwt token
router.post('/register', async (req, res) => {
    const { email, username, password, name } = req.body;

    try {
        // check if user already exists
        const user = await pool.query(
            "SELECT * FROM users WHERE user_email = $1", [email]
        );

        if (user.rows.length > 0) {
            return res.status(401).json('User already exists.'); // error 401 = unauthorised
        }

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // insert new user
        let newUser = await pool.query(
            "INSERT INTO users (user_name, username, user_email, user_password) VALUES ($1, $2, $3, $4) RETURNING *",
            [name, username, email, hashedPassword]
        );

        // generate token
        const token = jwtGenerator(newUser.rows[0].user_id);

        return res.json({ token });
    } catch (err) {
        res.status(500).send("Server error");
    }
});

// login a user and generate a jwt token
router.post('/login', async (req, res) => {

    // email const can be either an email address or username
    const { email, password } = req.body;

    try {
        // check if user exists
        const user = await pool.query(
            "SELECT * FROM users WHERE (user_email = $1) OR (username = $1)", [email]
        )

        if (user.rows.length === 0) {
            return res.status(401).json("Incorrect email or password");
        }

        // check if password is correct
        const validPassword = bcrypt.compare(password, user.rows[0].user_password);

        if (!validPassword) {
            return res.status(401).json("Incorrect email or password");
        }

        // generate token
        const token = jwtGenerator(user.rows[0].user_id);

        return res.json({ token });
    } catch (err) {
        res.status(500).send("Server error");
    }
});

// check that the user is authorised
router.post('/verify', authorise, (req, res) => {
    try {
        return res.json(true);
    } catch (err) {
        return res.status(500).json('Server error.');
    }
});

module.exports = router;