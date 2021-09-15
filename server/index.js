const express = require('express');
const cors = require('cors');
const path = require("path");
const app = express();

//MIDDLEWARE
app.use(cors());
app.use(express.json());

//ROUTES
app.use('/auth', require('./routes/authentication.js'));
app.use('/dashboard', require('./routes/dashboard.js'));

if (process.env.NODE_ENV === 'production') {
// if (true) {
    app.use(express.static('build'));
    app.get('*/', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
    });
}

//HOSTING
app.listen(process.env.PORT || 5000, (req, res) => {
    console.log("Server running.");
})
