// db.js
const { Pool } = require('pg');

// Create a new pool instance with your PostgreSQL connection details
const pool = new Pool({
    user: 'nathan', // replace with your PostgreSQL username
    host: 'localhost',
    database: 'typing_battle', // replace with your PostgreSQL database name
    password: 'lullaby180100', // replace with your PostgreSQL password
    port: 5432, // default port for PostgreSQL
});

module.exports = pool;
