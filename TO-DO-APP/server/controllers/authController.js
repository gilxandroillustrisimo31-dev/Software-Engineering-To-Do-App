const User = require('../models/User');
const crypto = require('crypto');

// Generate a simple token (in production, use JWT library)
const generateToken = (userId) => {
  return crypto.randomBytes(32).toString('hex');
};

// In-memory token store (in production, use Redis or database)
const tokenStore = new Map();

// Register a new user
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    if (username.length < 3) {
      return res.status(400).json({ error: 'Username must be at least 3 characters' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if username already exists
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      return res.status(400).json({ error: 'Username already taken' });
    }

    // Check if email already exists
    const existingEmail = await User.findByEmail(email);
    if (existingEmail) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create new user
    const newUser = await User.create({ username, email, password });

    res.status(201).json({
      message: 'User registered successfully',
      userId: newUser.id,
      username: newUser.username,
      email: newUser.email
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Find user by username
    const user = await User.findByUsername(username);
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Verify password
    const isPasswordValid = User.verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Generate token
    const token = generateToken(user.id);
    tokenStore.set(token, {
      userId: user.id,
      username: user.username,
      createdAt: new Date()
    });

    res.status(200).json({
      message: 'Login successful',
      token,
      userId: user.id,
      username: user.username
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
};

// Verify token middleware
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const tokenData = tokenStore.get(token);
  if (!tokenData) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  // Check if token is older than 30 days
  const tokenAge = new Date() - tokenData.createdAt;
  const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
  if (tokenAge > thirtyDaysInMs) {
    tokenStore.delete(token);
    return res.status(401).json({ error: 'Token expired' });
  }

  req.userId = tokenData.userId;
  req.username = tokenData.username;
  next();
};

// Logout user
const logout = (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (token) {
    tokenStore.delete(token);
  }
  res.status(200).json({ message: 'Logged out successfully' });
};

module.exports = {
  register,
  login,
  logout,
  verifyToken
};
