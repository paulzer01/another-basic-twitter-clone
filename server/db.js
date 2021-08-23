const { Pool } = require('pg');

const pool = new Pool({
    host: "localhost",
    user: "postgres",
    password: "postgres",
    port: 5432,
    database: "twitterclone"
});

module.exports = pool;