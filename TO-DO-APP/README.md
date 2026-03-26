# To-Do List Application

A full-stack to-do list application with user authentication built with Node.js, Express, MySQL, and Vanilla JavaScript. This project allows users to register, login, and manage their tasks with a clean, modern glassmorphism interface.

## Features

- **User Authentication**: Secure login and registration system
- **Create tasks** with title, description, and due date
- **View personal tasks** in a clean, organized list sorted by creation date (newest first)
- **Update tasks** with inline editing
- **Delete tasks** with confirmation
- **Mark tasks as complete** with checkboxes
- **Real-time UI updates** without page reload
- **Responsive design** that works on desktop and mobile
- **Data persistence** with MySQL database
- **Glassmorphism UI** with frosted glass effects and smooth animations

## Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **API**: RESTful with JSON
- **Security**: Token-based authentication

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v12 or higher) - [Download here](https://nodejs.org/)
- **MySQL** (v5.7 or higher) - [Download here](https://www.mysql.com/downloads/)

## Installation & Setup

### Step 1: Create the Database

1. Open MySQL command line or MySQL Workbench
2. Run the following command:
   ```sql
   CREATE DATABASE IF NOT EXISTS todo_app;
   ```
3. Navigate to the project folder and run the schema:
   ```bash
   cd d:\CPSU Programming\Software Engineering\TO-DO-APP
   mysql -u root -p todo_app < database/schema.sql
   ```
   (Enter your MySQL password when prompted)

### Step 2: Set Up the Backend Server

1. Navigate to the server directory:
   ```bash
   cd d:\CPSU Programming\Software Engineering\TO-DO-APP\server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. (Optional) Update database credentials in `server/config/db.js` if your MySQL setup is different:
   ```javascript
   const pool = mysql.createPool({
     host: 'localhost',
     user: 'root',     // Change if needed
     password: '',     // Add your MySQL password
     database: 'todo_app'
   });
   ```

4. Start the server:
   ```bash
   node server.js
   ```
   or (if using nodemon for development):
   ```bash
   npx nodemon server.js
   ```

   You should see: `To-Do List API is listening on port 3000`

### Step 3: Run the Frontend

1. Open a new terminal and navigate to the project root
2. Use a live server to serve the frontend. You can:
   - Use the VS Code Live Server extension (right-click `client/index.html` → "Open with Live Server")
   - Or use Python's built-in server (if you have Python):
     ```bash
     cd client
     python -m http.server 5500
     ```
   - Or use Node's `http-server`:
     ```bash
     npx http-server client -p 5500
     ```

3. Open your browser and go to `http://localhost:5500` (or your configured port)

## Project Structure

```
/TO-DO-APP
├── /client
│   ├── index.html
│   └── /assets
│       ├── /css
│       │   └── styles.css
│       └── /js
│           ├── api.js
│           ├── main.js
│           └── utils.js
├── /server
│   ├── server.js
│   ├── /config
│   │   └── db.js
│   ├── /controllers
│   │   └── taskController.js
│   ├── /models
│   │   └── Task.js
│   ├── /routes
│   │   └── taskRoutes.js
│   └── package.json
├── /database
│   └── schema.sql
└── README.md
```

## API Endpoints

All endpoints return JSON and are prefixed with `/api/tasks`.

### GET /api/tasks
Retrieve all tasks sorted by creation date (newest first).

**Response:**
```json
[
  {
    "id": 1,
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "due_date": "2025-04-10",
    "status": "pending",
    "created_at": "2025-03-18T10:30:00.000Z"
  }
]
```

### POST /api/tasks
Create a new task.

**Request body:**
```json
{
  "title": "Complete project",
  "description": "Finish the to-do app",
  "due_date": "2025-04-15"
}
```

**Response:** The created task object

### PUT /api/tasks/:id
Update an existing task.

**Request body:**
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "due_date": "2025-04-20",
  "status": "completed"
}
```

**Response:** The updated task object

### DELETE /api/tasks/:id
Delete a task by ID.

**Response:**
```json
{
  "message": "Task deleted successfully"
}
```

### PATCH /api/tasks/:id/toggle
Toggle the task status between "pending" and "completed".

**Response:** The updated task object

## Task Properties

- **id**: Auto-generated unique identifier
- **title**: Task title (required, string)
- **description**: Task description (optional, string)
- **due_date**: Due date (optional, format: YYYY-MM-DD)
- **status**: Task status (enum: "pending" or "completed", default: "pending")
- **created_at**: Timestamp when the task was created (auto-set)

## Frontend Features

- **Add Task Form**: At the top, allows entering title, description, and due date
- **Task List**: Displays all tasks with:
  - Checkbox to toggle completion status
  - Title (bold for pending, strikethrough for completed)
  - Description (if provided)
  - Due date (formatted as "Month Day, Year")
  - Edit button for inline editing
  - Delete button with confirmation
- **Real-time updates**: UI updates immediately after any operation
- **Error handling**: User-friendly error messages for failed operations

## Error Handling

- The frontend displays error messages for failed API calls
- The backend validates input and returns appropriate HTTP status codes:
  - `200 OK`: Successful GET, PUT, PATCH, DELETE
  - `201 Created`: Successful POST
  - `400 Bad Request`: Invalid input
  - `500 Internal Server Error`: Server-side error

## Assumptions & Limitations

- **Single User**: The application does not include user authentication
- **Local Database**: Assumes MySQL is running locally with default credentials
- **CORS Enabled**: Frontend and backend run on different ports; CORS is enabled
- **No Real-time Sync**: Updates are not synced across multiple browser tabs in real-time

## Troubleshooting

### "Cannot GET /" when opening client
Make sure you're serving the client folder with a web server (not opening the HTML file directly).

### "Failed to fetch tasks" error
- Ensure the backend server is running on port 3000
- Check that MySQL is running
- Verify the database connection in `server/config/db.js`

### "Access denied for user 'root'" MySQL error
Update the credentials in `server/config/db.js` to match your MySQL setup.

### Port 3000 already in use
Either kill the process using port 3000 or change the PORT in `server/server.js`.

## Development Tips

- Use `nodemon` for automatic server restart during development: `npm install -D nodemon`
- Use the browser's DevTools (F12) to debug JavaScript and view network requests
- Use MySQL Workbench to inspect your database

## Future Enhancements

- User authentication and authorization
- Task categories and tags
- Task priorities and filtering
- Due date notifications
- Task history and undo/redo
- Dark mode
- Multi-user collaboration

## License

This project is open source and available under the MIT License.

---

**Happy organizing!** 🎯
