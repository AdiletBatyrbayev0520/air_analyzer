const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: 'user',
    password: 'root',
    host: 'air_analyzer-postgres',
    port: 5432,
    database: 'postgres'
});

module.exports = pool;