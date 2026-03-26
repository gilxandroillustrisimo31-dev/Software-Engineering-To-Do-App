const express = require('express');
const cors = require('cors');
const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'To-Do List API is running' });
});

// Mount auth routes under /api/auth
app.use('/api/auth', authRoutes);

// Mount task routes under /api/tasks
app.use('/api/tasks', taskRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`To-Do List API is listening on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to test the API`);
});

module.exports = app;
