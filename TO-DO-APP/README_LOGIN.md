# To-Do List Application with User Authentication

A full-stack to-do list application with secure user authentication built with Node.js, Express, MySQL, and Vanilla JavaScript. Features a beautiful glassmorphism UI with frosted glass effects.

## ✨ Features

- **🔐 User Authentication**: Secure login and registration system with token-based authentication
- **✏️ Create Tasks**: Add tasks with title, description, and due date
- **📋 View Tasks**: Personal task list sorted by newest first
- **🔄 Update Tasks**: Edit tasks inline with ease
- **🗑️ Delete Tasks**: Remove tasks with confirmation
- **✅ Mark Complete**: Check/uncheck tasks to toggle status
- **🎨 Glassmorphism UI**: Modern frosted glass design with smooth animations
- **📱 Responsive**: Works perfectly on desktop and mobile devices
- **⚡ Real-time Updates**: No page reload needed for operations
- **💾 Data Persistence**: All data stored in MySQL database

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **API**: RESTful with JSON
- **Security**: Token-based authentication with SHA-256 password hashing

## 📋 Prerequisites

Before you start, make sure you have:
- **Node.js** (v12 or higher) - [Download](https://nodejs.org/)
- **MySQL** (v5.7 or higher) - [Download](https://www.mysql.com/downloads/)

## 🚀 Quick Start

### Step 1: Database Setup

1. Open MySQL and create the database:
   ```bash
   mysql -u root -p
   # Then type your password
   ```

2. In MySQL command line:
   ```sql
   CREATE DATABASE IF NOT EXISTS todo_app;
   ```

3. Run the schema file:
   ```bash
   cd d:\CPSU Programming\Software Engineering\TO-DO-APP
   mysql -u root -p todo_app < database/schema.sql
   ```

### Step 2: Backend Setup

1. Navigate to server directory:
   ```bash
   cd d:\CPSU Programming\Software Engineering\TO-DO-APP\server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. (Optional) Update database credentials in `server/config/db.js`:
   ```javascript
   const pool = mysql.createPool({
     host: 'localhost',
     user: 'root',        // Your MySQL user
     password: '',        // Your MySQL password
     database: 'todo_app'
   });
   ```

4. Start the backend server:
   ```bash
   node server.js
   ```
   or for development with auto-reload:
   ```bash
   npm run dev
   ```

   ✅ You should see: `To-Do List API is listening on port 3000`

### Step 3: Frontend Setup

1. Open a new terminal and navigate to client directory:
   ```bash
   cd d:\CPSU Programming\Software Engineering\TO-DO-APP\client
   ```

2. Serve the frontend using one of these methods:

   **Option A: VS Code Live Server**
   - Right-click `login.html` → "Open with Live Server"

   **Option B: Python**
   ```bash
   python -m http.server 5500
   ```

   **Option C: Node http-server**
   ```bash
   npx http-server . -p 5500
   ```

3. Open your browser:
   ```
   http://localhost:5500/login.html
   ```

## 📖 How to Use

### 1. **Register**
   - Click "Create one" link on the login page
   - Enter username (3+ characters), email, and password (6+ characters)
   - Confirm your password matches
   - Click "Create Account"

### 2. **Login**
   - Enter your username and password
   - Click "Login"
   - You'll be redirected to your to-do dashboard

### 3. **Add Tasks**
   - Enter task title (required)
   - Optionally add description and due date
   - Click "Add Task"

### 4. **Manage Tasks**
   - ✅ Check the checkbox to mark task as complete
   - ✏️ Click "Edit" to modify a task inline
   - 🗑️ Click "Delete" to remove a task
   - Tasks auto-save to the database

### 5. **Logout**
   - Click "Logout" button in the top right
   - You'll be returned to the login page

## 📁 Project Structure

```
TO-DO-APP/
├── client/
│   ├── login.html           (Login/Register page)
│   ├── index.html           (Main app page)
│   └── assets/
│       ├── css/
│       │   └── styles.css   (All styling with glassmorphism)
│       └── js/
│           ├── auth.js      (Login/register logic)
│           ├── api.js       (API calls with auth)
│           ├── main.js      (Todo app logic)
│           └── utils.js     (Helper functions)
├── server/
│   ├── server.js            (Express server setup)
│   ├── package.json
│   ├── config/
│   │   └── db.js            (MySQL connection)
│   ├── controllers/
│   │   ├── authController.js (Auth logic)
│   │   └── taskController.js (Task logic)
│   ├── models/
│   │   ├── User.js          (User database ops)
│   │   └── Task.js          (Task database ops)
│   └── routes/
│       ├── authRoutes.js    (Auth endpoints)
│       └── taskRoutes.js    (Task endpoints)
├── database/
│   └── schema.sql           (Database schema)
└── README.md
```

## 🔌 API Endpoints

### Authentication Endpoints (`/api/auth`)

#### POST /api/auth/register
Register a new user.
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### POST /api/auth/login
Login and get authentication token.
```json
{
  "username": "john_doe",
  "password": "password123"
}
```

Returns:
```json
{
  "token": "authentication_token",
  "userId": 1,
  "username": "john_doe"
}
```

### Task Endpoints (`/api/tasks`)

All task endpoints require the `Authorization: Bearer <token>` header.

#### GET /api/tasks
Get all tasks for the logged-in user.

#### POST /api/tasks
Create a new task.
```json
{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "due_date": "2025-04-15"
}
```

#### PUT /api/tasks/:id
Update a task by ID.

#### DELETE /api/tasks/:id
Delete a task by ID.

#### PATCH /api/tasks/:id/toggle
Toggle task status (pending ↔ completed).

## 🗄️ Database Schema

### Users Table
- `id` (INT, Primary Key, Auto Increment)
- `username` (VARCHAR 50, Unique)
- `email` (VARCHAR 100, Unique)
- `password` (VARCHAR 255, SHA-256 hashed)
- `created_at` (TIMESTAMP)

### Tasks Table
- `id` (INT, Primary Key, Auto Increment)
- `user_id` (INT, Foreign Key → users.id)
- `title` (VARCHAR 255)
- `description` (TEXT)
- `due_date` (DATE)
- `status` (ENUM: 'pending', 'completed')
- `created_at` (TIMESTAMP)

## 🔒 Security

- Passwords are hashed using SHA-256
- Token-based authentication for all task operations
- CORS enabled for cross-origin requests
- User sessions isolated by token
- Tasks filtered by user_id in database

## 🧪 Testing

### Register a Test User
Navigate to login page and:
1. Click "Create one"
2. Username: `testuser`
3. Email: `test@example.com`
4. Password: `test123`
5. Confirm password: `test123`
6. Click "Create Account"

### Login with Test User
1. Username: `testuser`
2. Password: `test123`
3. Click "Login"

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| **MySQL Connection Error** | Verify credentials in `server/config/db.js` match your MySQL setup |
| **Port 3000 Already in Use** | Change `PORT` in `server/server.js` or kill the process using port 3000 |
| **CORS Errors** | CORS is already enabled in server.js, check server is running on port 3000 |
| **Cannot log in after registration** | Check MySQL has the new user in the database |
| **Frontend not loading** | Make sure you're serving the frontend with a web server, not opening HTML directly |
| **Tasks not saving** | Ensure backend is running and token is being sent in Authorization header |
| **Session expired** | Login again to get a new token |

## 🚀 Development

### Run with Auto-Reload (Backend)
```bash
cd server
npm run dev
```
This uses `nodemon` to auto-restart the server when files change.

### Using Browser DevTools
- Press F12 to open Developer Tools
- Check Console for errors
- Check Network tab to see API calls

## 📝 Notes

- Users can only see and manage their own tasks
- Tokens are stored in browser's `localStorage`
- Tokens expire after 30 days of inactivity
- All passwords are hashed; plain text is never stored

## 🎨 UI Features

- **Glassmorphism Design**: Modern frosted glass effect
- **Dark Theme**: Black background with semi-transparent containers
- **Smooth Animations**: Slide-in effects and hover states
- **Mobile Responsive**: Optimized for all screen sizes
- **Form Validation**: Client-side validation on registration
- **Error Messages**: User-friendly error feedback
- **Loading States**: Visual feedback during operations

## 📦 Dependencies

### Backend
- `express`: Web framework
- `mysql2`: MySQL connection
- `cors`: Cross-origin requests
- `nodemon` (dev): Auto-restart on file changes

### Frontend
- Vanilla JavaScript (no frameworks)
- HTML5
- CSS3 with Glassmorphism

## 📄 License

This project is open source and available under the MIT License.

---

**Happy organizing! 🎯**

For issues or questions, make sure:
1. MySQL is running
2. Backend server is running on port 3000
3. Frontend is served from a web server
4. You're using the correct database credentials
