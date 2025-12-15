const { Pool } = require('pg');
require('dotenv').config();

// Connection pool is a group of reusuable connections to database
// allows caching of connections instead of reinitializing every query
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})

pool.on('connect', () => {
    console.log('Connected to PostgreSQL Database');
})

pool.on('error', (err) => {
    console.error(`Error on database client: ${err}`);
    process.exit(-1);
});

module.exports = pool;