const pool = require('../config/db');

const Task = {
  // Get all tasks for a specific user sorted by creation date (newest first)
  getAll: async (userId) => {
    const [rows] = await pool.query(
      'SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    return rows;
  },

  // Create a new task
  create: async (taskData) => {
    const { userId, title, description, due_date } = taskData;
    const [result] = await pool.query(
      'INSERT INTO tasks (user_id, title, description, due_date) VALUES (?, ?, ?, ?)',
      [userId, title, description || null, due_date || null]
    );
    // Return the newly created task
    const [newTask] = await pool.query(
      'SELECT * FROM tasks WHERE id = ?',
      [result.insertId]
    );
    return newTask[0];
  },

  // Update a task
  update: async (id, taskData) => {
    const { title, description, due_date, status } = taskData;
    const updates = [];
    const values = [];

    if (title !== undefined) {
      updates.push('title = ?');
      values.push(title);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      values.push(description);
    }
    if (due_date !== undefined) {
      updates.push('due_date = ?');
      values.push(due_date);
    }
    if (status !== undefined) {
      updates.push('status = ?');
      values.push(status);
    }

    if (updates.length === 0) {
      return { affectedRows: 0 };
    }

    values.push(id);
    const query = `UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`;
    const [result] = await pool.query(query, values);
    
    // Return the updated task
    const [updatedTask] = await pool.query(
      'SELECT * FROM tasks WHERE id = ?',
      [id]
    );
    return updatedTask[0];
  },

  // Delete a task
  delete: async (id) => {
    const [result] = await pool.query(
      'DELETE FROM tasks WHERE id = ?',
      [id]
    );
    return result;
  },

  // Toggle task status (pending <-> completed)
  toggleStatus: async (id) => {
    const [task] = await pool.query(
      'SELECT status FROM tasks WHERE id = ?',
      [id]
    );

    if (task.length === 0) {
      throw new Error('Task not found');
    }

    const newStatus = task[0].status === 'pending' ? 'completed' : 'pending';
    const [result] = await pool.query(
      'UPDATE tasks SET status = ? WHERE id = ?',
      [newStatus, id]
    );

    // Return the updated task
    const [updatedTask] = await pool.query(
      'SELECT * FROM tasks WHERE id = ?',
      [id]
    );
    return updatedTask[0];
  }
};

module.exports = Task;
