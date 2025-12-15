const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABSE_URL,
})

pool.on('connect', () => {
    console.log('Connected to PostgreSQL Database');
})

pool.on('error', (err) => {
    console.error(`Error on database client: ${err}`);
    process.exit(-1);
});

module.exports = pool;