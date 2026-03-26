const mysql = require('mysql2/promise');

// Create a connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'todo_app',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Handle connection errors
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

module.exports = pool;
