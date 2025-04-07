const pg = require('pg');
const dotenv = require('dotenv');
const fs = require('fs').promises;
const path = require('path');

dotenv.config();

const pool = new pg.Pool({
  connectionString: process.env.PG_URI || 'postgres://user:root@localhost:5432/postgres',
});

async function init() {
  try {
    await pool.connect();
    console.log('Connected to PostgreSQL');

    // Читаем SQL файл
    const sqlFile = await fs.readFile(path.join(__dirname, 'init_db.sql'), 'utf8');
    
    // Выполняем SQL запросы
    await pool.query(sqlFile);
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

module.exports = { init, pool };

