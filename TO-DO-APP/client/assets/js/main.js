// Main application logic for the To-Do List

// Check authentication
function checkAuth() {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

// Get auth token
function getAuthToken() {
  return localStorage.getItem('token');
}

// Logout function
function logout() {
  if (confirm('Are you sure you want to logout?')) {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    window.location.href = 'login.html';
  }
}

let allTasks = [];
let editingTaskId = null;

// DOM Elements
const taskListEl = document.getElementById('task-list');
const addTaskFormEl = document.getElementById('add-task-form');
const errorMessageEl = document.getElementById('error-message');
const taskTitleInput = document.getElementById('task-title');
const taskDescriptionInput = document.getElementById('task-description');
const taskDueDateInput = document.getElementById('task-due-date');

/**
 * Show error message to the user
 * @param {string} message - Error message to display
 */
function showError(message) {
  errorMessageEl.textContent = message;
  errorMessageEl.style.display = 'block';
  setTimeout(() => {
    errorMessageEl.style.display = 'none';
  }, 5000);
}

/**
 * Render all tasks to the DOM
 * @param {Array} tasks - Array of task objects
 */
function renderTasks(tasks) {
  // Clear the task list
  taskListEl.innerHTML = '';

  if (tasks.length === 0) {
    taskListEl.innerHTML = '<p class="loading">No tasks yet. Add one to get started!</p>';
    return;
  }

  // Render each task
  tasks.forEach((task) => {
    const taskEl = createTaskElement(task);
    taskListEl.appendChild(taskEl);
  });
}

/**
 * Create a DOM element for a task
 * @param {Object} task - Task object
 * @returns {HTMLElement} Task element
 */
function createTaskElement(task) {
  const taskDiv = document.createElement('div');
  taskDiv.className = 'task-item';
  taskDiv.id = `task-${task.id}`;

  // Task checkbox
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'task-checkbox';
  checkbox.checked = task.status === 'completed';
  checkbox.addEventListener('change', () => handleToggleStatus(task.id));

  // Task content container
  const contentDiv = document.createElement('div');
  contentDiv.className = 'task-content';

  // Task title
  const titleEl = document.createElement('div');
  titleEl.className = `task-title ${task.status === 'completed' ? 'completed' : ''}`;
  titleEl.textContent = escapeHtml(task.title);

  // Task description
  let descriptionEl = null;
  if (task.description) {
    descriptionEl = document.createElement('div');
    descriptionEl.className = 'task-description';
    descriptionEl.textContent = escapeHtml(task.description);
  }

  // Task due date
  let dueDateEl = null;
  if (task.due_date) {
    dueDateEl = document.createElement('div');
    dueDateEl.className = 'task-due-date';
    dueDateEl.textContent = `Due: ${formatDate(task.due_date)}`;
  }

  // Append content elements
  contentDiv.appendChild(titleEl);
  if (descriptionEl) {
    contentDiv.appendChild(descriptionEl);
  }
  if (dueDateEl) {
    contentDiv.appendChild(dueDateEl);
  }

  // Task actions (buttons)
  const actionsDiv = document.createElement('div');
  actionsDiv.className = 'task-actions';

  const editBtn = document.createElement('button');
  editBtn.className = 'btn btn-secondary';
  editBtn.textContent = 'Edit';
  editBtn.addEventListener('click', () => handleEditTask(task));

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'btn btn-danger';
  deleteBtn.textContent = 'Delete';
  deleteBtn.addEventListener('click', () => handleDeleteTask(task.id));

  actionsDiv.appendChild(editBtn);
  actionsDiv.appendChild(deleteBtn);

  // Assemble the task element
  taskDiv.appendChild(checkbox);
  taskDiv.appendChild(contentDiv);
  taskDiv.appendChild(actionsDiv);

  return taskDiv;
}

/**
 * Handle adding a new task
 * @param {Event} event - Form submission event
 */
async function handleAddTask(event) {
  event.preventDefault();

  const title = taskTitleInput.value.trim();
  const description = taskDescriptionInput.value.trim();
  const due_date = taskDueDateInput.value || null;

  if (!title) {
    showError('Please enter a task title');
    return;
  }

  try {
    const newTask = await createTask({
      title,
      description: description || null,
      due_date
    });

    // Add the new task to the list and re-render
    allTasks.unshift(newTask);
    renderTasks(allTasks);

    // Clear the form
    addTaskFormEl.reset();
  } catch (error) {
    showError(`Error adding task: ${error.message}`);
  }
}

/**
 * Handle editing a task (inline form)
 * @param {Object} task - Task object to edit
 */
function handleEditTask(task) {
  const taskEl = document.getElementById(`task-${task.id}`);

  // Check if already in edit mode
  if (editingTaskId === task.id) {
    return;
  }

  // Close any other edit forms
  if (editingTaskId !== null) {
    const previousEditEl = document.getElementById(`task-${editingTaskId}`);
    if (previousEditEl) {
      previousEditEl.querySelector('.task-edit-form')?.remove();
    }
    editingTaskId = null;
  }

  // Create edit form
  const editForm = document.createElement('div');
  editForm.className = 'task-edit-form';

  const titleGroup = document.createElement('div');
  titleGroup.className = 'form-group';
  const titleLabel = document.createElement('label');
  titleLabel.textContent = 'Title';
  const titleInput = document.createElement('input');
  titleInput.type = 'text';
  titleInput.value = task.title;
  titleGroup.appendChild(titleLabel);
  titleGroup.appendChild(titleInput);

  const descGroup = document.createElement('div');
  descGroup.className = 'form-group';
  const descLabel = document.createElement('label');
  descLabel.textContent = 'Description';
  const descInput = document.createElement('textarea');
  descInput.value = task.description || '';
  descInput.rows = '2';
  descGroup.appendChild(descLabel);
  descGroup.appendChild(descInput);

  const dateGroup = document.createElement('div');
  dateGroup.className = 'form-group';
  const dateLabel = document.createElement('label');
  dateLabel.textContent = 'Due Date';
  const dateInput = document.createElement('input');
  dateInput.type = 'date';
  dateInput.value = task.due_date || '';
  dateGroup.appendChild(dateLabel);
  dateGroup.appendChild(dateInput);

  const actionsDiv = document.createElement('div');
  actionsDiv.className = 'task-actions';

  const saveBtn = document.createElement('button');
  saveBtn.className = 'btn btn-primary';
  saveBtn.textContent = 'Save';
  saveBtn.style.width = 'auto';
  saveBtn.addEventListener('click', () =>
    handleSaveEditTask(task.id, titleInput.value, descInput.value, dateInput.value)
  );

  const cancelBtn = document.createElement('button');
  cancelBtn.className = 'btn btn-secondary';
  cancelBtn.textContent = 'Cancel';
  cancelBtn.style.width = 'auto';
  cancelBtn.addEventListener('click', () => {
    editForm.remove();
    editingTaskId = null;
  });

  actionsDiv.appendChild(saveBtn);
  actionsDiv.appendChild(cancelBtn);

  editForm.appendChild(titleGroup);
  editForm.appendChild(descGroup);
  editForm.appendChild(dateGroup);
  editForm.appendChild(actionsDiv);

  // Insert the edit form after the content div
  const contentDiv = taskEl.querySelector('.task-content');
  contentDiv.parentNode.insertBefore(editForm, actionsDiv);

  // Hide the action buttons
  taskEl.querySelector('.task-actions').style.display = 'none';

  editingTaskId = task.id;
}

/**
 * Handle saving an edited task
 * @param {number} id - Task ID
 * @param {string} title - New title
 * @param {string} description - New description
 * @param {string} due_date - New due date
 */
async function handleSaveEditTask(id, title, description, due_date) {
  if (!title.trim()) {
    showError('Task title cannot be empty');
    return;
  }

  try {
    const updatedTask = await updateTask(id, {
      title: title.trim(),
      description: description.trim() || null,
      due_date: due_date || null
    });

    // Update the task in the list
    const taskIndex = allTasks.findIndex((t) => t.id === id);
    if (taskIndex !== -1) {
      allTasks[taskIndex] = updatedTask;
    }

    renderTasks(allTasks);
    editingTaskId = null;
  } catch (error) {
    showError(`Error updating task: ${error.message}`);
  }
}

/**
 * Handle deleting a task
 * @param {number} id - Task ID
 */
async function handleDeleteTask(id) {
  if (!confirm('Are you sure you want to delete this task?')) {
    return;
  }

  try {
    await deleteTask(id);

    // Remove the task from the list
    allTasks = allTasks.filter((task) => task.id !== id);
    renderTasks(allTasks);
  } catch (error) {
    showError(`Error deleting task: ${error.message}`);
  }
}

/**
 * Handle toggling task status
 * @param {number} id - Task ID
 */
async function handleToggleStatus(id) {
  try {
    const updatedTask = await toggleTaskStatus(id);

    // Update the task in the list
    const taskIndex = allTasks.findIndex((t) => t.id === id);
    if (taskIndex !== -1) {
      allTasks[taskIndex] = updatedTask;
    }

    renderTasks(allTasks);
  } catch (error) {
    showError(`Error toggling task status: ${error.message}`);
  }
}

/**
 * Load all tasks from the server and render them
 */
async function loadTasks() {
  try {
    allTasks = await getTasks();
    renderTasks(allTasks);
  } catch (error) {
    showError(`Error loading tasks: ${error.message}`);
    taskListEl.innerHTML = '<p class="loading">Failed to load tasks. Please refresh the page.</p>';
  }
}

// Initialize the application on page load
document.addEventListener('DOMContentLoaded', () => {
  // Check if user is authenticated
  if (!checkAuth()) {
    return;
  }

  // Display username
  const username = localStorage.getItem('username');
  const usernameDisplay = document.getElementById('username-display');
  if (usernameDisplay && username) {
    usernameDisplay.textContent = `Welcome, ${escapeHtml(username)}`;
  }

  // Load tasks from the server
  loadTasks();

  // Attach event listener to the add-task form
  addTaskFormEl.addEventListener('submit', handleAddTask);
});
