const POSTGRES_HOST = process.env.POSTGRES_HOST;
const POSTGRES_PORT = process.env.POSTGRES_PORT;
const POSTGRES_USER = process.env.POSTGRES_USER;
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD;
const POSTGRES_DB = process.env.POSTGRES_DB;

const pg =require('pg')
const { Pool } = require('pg');

const pgPool = new Pool({
    host: POSTGRES_HOST,
    port: POSTGRES_PORT,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    database: POSTGRES_DB
});

async function connect() {
    try {
        await pgPool.connect();
        console.log('PostgreSQL Connected!');

    } catch (err) {
        console.error('PostgreSQL connection error:', err);
    }
}

// Reusable query function
async function query(text, params) {
    return pgPool.query(text, params);
}


module.exports = { connect, query, pgPool };