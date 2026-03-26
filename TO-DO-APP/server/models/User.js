const pool = require('../config/db');
const crypto = require('crypto');

const User = {
  // Hash password using crypto
  hashPassword: (password) => {
    return crypto
      .createHash('sha256')
      .update(password)
      .digest('hex');
  },

  // Find user by username
  findByUsername: async (username) => {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    return rows[0] || null;
  },

  // Find user by email
  findByEmail: async (email) => {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0] || null;
  },

  // Find user by ID
  findById: async (id) => {
    const [rows] = await pool.query(
      'SELECT id, username, email, created_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  },

  // Create a new user
  create: async (userData) => {
    const { username, email, password } = userData;
    const hashedPassword = User.hashPassword(password);

    const [result] = await pool.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );

    // Return the newly created user (without password)
    return User.findById(result.insertId);
  },

  // Verify password
  verifyPassword: (password, hashedPassword) => {
    const hash = crypto
      .createHash('sha256')
      .update(password)
      .digest('hex');
    return hash === hashedPassword;
  }
};

module.exports = User;
