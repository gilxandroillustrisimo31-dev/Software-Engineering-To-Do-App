const Task = require('../models/Task');

// Get all tasks for the logged-in user
const getTasks = async (req, res) => {
  try {
    const userId = req.userId;
    const tasks = await Task.getAll(userId);
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

// Create a new task for the logged-in user
const createTask = async (req, res) => {
  try {
    const userId = req.userId;
    const { title, description, due_date } = req.body;

    // Validate that title is present
    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required' });
    }

    const newTask = await Task.create({ userId, title, description, due_date });
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
};

// Update a task
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate id
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid task ID' });
    }

    const updatedTask = await Task.update(parseInt(id), req.body);
    res.status(200).json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate id
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid task ID' });
    }

    await Task.delete(parseInt(id));
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
};

// Toggle task status
const toggleTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate id
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid task ID' });
    }

    const updatedTask = await Task.toggleStatus(parseInt(id));
    res.status(200).json(updatedTask);
  } catch (error) {
    console.error('Error toggling task status:', error);
    res.status(500).json({ error: 'Failed to toggle task status' });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskStatus
};
