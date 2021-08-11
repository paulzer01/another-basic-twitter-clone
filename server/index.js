const express = require('express');
const cors = require('cors');
const app = express();

//MIDDLEWARE
app.use(cors());
app.use(express.json());

//ROUTES
app.use('/auth', require('./routes/authentication.js'));
app.use('/dashboard', require('./routes/dashboard.js'));

//HOSTING
app.listen(5000, (req, res) => {
    console.log("Server running on port 5000.");
})
