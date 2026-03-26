// API functions for the To-Do List application

const API_BASE_URL = 'http://localhost:3000/api/tasks';

/**
 * Get the authorization headers with token
 * @returns {Object} Headers object with Authorization
 */
function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
}

/**
 * Handle API errors and check for unauthorized
 * @param {Response} response - Fetch response object
 */
async function handleAPIError(response) {
  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    window.location.href = 'login.html';
    throw new Error('Session expired. Please login again.');
  }
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'API error');
  }
  return response;
}

/**
 * Fetch all tasks from the server
 * @returns {Promise<Array>} Promise resolving to array of tasks
 */
async function getTasks() {
  try {
    const response = await fetch(API_BASE_URL, {
      headers: getAuthHeaders()
    });
    await handleAPIError(response);
    return await response.json();
  } catch (error) {
    console.error('Error in getTasks:', error);
    throw error;
  }
}

/**
 * Create a new task on the server
 * @param {Object} task - Task object with title, description, due_date
 * @returns {Promise<Object>} Promise resolving to the created task
 */
async function createTask(task) {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(task)
    });
    await handleAPIError(response);
    return await response.json();
  } catch (error) {
    console.error('Error in createTask:', error);
    throw error;
  }
}

/**
 * Update an existing task on the server
 * @param {number} id - Task ID
 * @param {Object} updates - Object with fields to update
 * @returns {Promise<Object>} Promise resolving to the updated task
 */
async function updateTask(id, updates) {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    });
    await handleAPIError(response);
    return await response.json();
  } catch (error) {
    console.error('Error in updateTask:', error);
    throw error;
  }
}

/**
 * Delete a task from the server
 * @param {number} id - Task ID
 * @returns {Promise<Object>} Promise resolving to the response
 */
async function deleteTask(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    await handleAPIError(response);
    return await response.json();
  } catch (error) {
    console.error('Error in deleteTask:', error);
    throw error;
  }
}

/**
 * Toggle the status of a task (pending <-> completed)
 * @param {number} id - Task ID
 * @returns {Promise<Object>} Promise resolving to the updated task
 */
async function toggleTaskStatus(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}/toggle`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });
    await handleAPIError(response);
    return await response.json();
  } catch (error) {
    console.error('Error in toggleTaskStatus:', error);
    throw error;
  }
}
