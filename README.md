# TaskFlow Pro

A full-stack task management application with user authentication, role-based access control, and CRUD operations for tasks.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Backend Setup](#backend-setup)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Frontend Integration](#frontend-integration)
- [Development](#development)

## 🚀 Project Overview

TaskFlow Pro is a task management system that allows users to:

- Register and authenticate
- Create, read, update, and delete tasks
- Manage tasks with priorities and categories
- Admin panel for user and task management
- Role-based access control (User/Admin)

## 🛠 Tech Stack

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Socket.io** - Real-time communication (available)

### Frontend

- **HTML5** - Markup
- **CSS3** - Styling
- **Vanilla JavaScript** - Client-side logic

## 📁 Project Structure

```
taskflow-pro/
├── backend/
│   ├── server.js              # Main server file
│   ├── config/
│   │   └── database.js        # Database configuration
│   ├── db/
│   │   └── seeds/
│   │       └── role.js        # Role seeding
│   ├── middleware/
│   │   ├── auth.js           # Authentication middleware
│   │   └── role.js           # Role-based access control
│   ├── models/
│   │   ├── User.js           # User schema
│   │   ├── Task.js           # Task schema
│   │   ├── Role.js           # Role schema
│   │   └── RefreshToken.js   # Refresh token schema
│   ├── routes/
│   │   ├── auth.js           # Authentication routes
│   │   ├── task.js           # Task CRUD routes
│   │   └── admin.js          # Admin routes
│   └── utils/
│       ├── bcrypt-hash.js    # Password hashing utility
│       └── jwt.js            # JWT token utilities
├── frontend/
│   ├── index.html            # Main dashboard
│   ├── login.html            # Login/Register page
│   ├── script.js             # Frontend JavaScript
│   └── styles.css            # Styling
└── package.json              # Dependencies and scripts
```

## 🔧 Backend Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd taskflow-pro
```

2. **Install dependencies**

```bash
npm install
```

3. **Environment Configuration**

   - Copy `.env.example` to `.env`
   - Fill in your environment variables (see [Environment Variables](#environment-variables))

4. **Start the server**

```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:5500`

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
MONGODB_URL=mongodb://localhost:27017/taskflow-pro

# JWT Secrets (Use strong, random strings in production)
JWT_SECRET=your_super_secret_jwt_key_here
JWT_REFRESH_SECRET=your_super_secret_refresh_jwt_key_here

# Admin Configuration
ADMIN_EMAIL=admin@taskflow.com

# Server Configuration (Optional)
PORT=5500
NODE_ENV=development
```

## 🔐 Authentication

The application uses JWT-based authentication with:

- **Access tokens** (1 hour expiration)
- **Refresh tokens** (24 hours expiration)
- **Role-based access control** (User/Admin)

### Authentication Flow

1. User registers/logs in
2. Server returns access token and refresh token
3. Client includes access token in Authorization header
4. When access token expires, use refresh token to get new access token

## 📡 API Endpoints

### Base URL

```
http://localhost:5500
```

### Authentication Endpoints

| Method | Endpoint             | Description          | Body                      |
| ------ | -------------------- | -------------------- | ------------------------- |
| POST   | `/api/auth/register` | Register new user    | `{name, email, password}` |
| POST   | `/api/auth/login`    | Login user           | `{email, password}`       |
| POST   | `/api/auth/refresh`  | Refresh access token | `{refreshToken}`          |
| POST   | `/api/auth/logout`   | Logout user          | `{refreshToken}`          |

### Task Endpoints (Requires Authentication)

| Method | Endpoint           | Description        | Body                                                |
| ------ | ------------------ | ------------------ | --------------------------------------------------- |
| GET    | `/api/task`        | Get all user tasks | -                                                   |
| POST   | `/api/task/create` | Create new task    | `{title, description?, category?, priority?}`       |
| GET    | `/api/task/:id`    | Get specific task  | -                                                   |
| PUT    | `/api/task/:id`    | Update task        | `{title?, description?, category?, priority?, ...}` |
| DELETE | `/api/task/:id`    | Delete task        | -                                                   |

### Admin Endpoints (Requires Admin Role)

| Method | Endpoint               | Description   |
| ------ | ---------------------- | ------------- |
| GET    | `/api/admin/users`     | Get all users |
| GET    | `/api/admin/tasks`     | Get all tasks |
| DELETE | `/api/admin/users/:id` | Delete user   |
| DELETE | `/api/admin/tasks/:id` | Delete task   |

### Request Headers

For protected routes, include the JWT token:

```http
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

### Response Format

**Success Response:**

```json
{
  "message": "Success message",
  "data": { ... },
  "token": "jwt_token" // (for auth endpoints)
}
```

**Error Response:**

```json
{
  "message": "Error message"
}
```

## 🎨 Frontend Integration

### Authentication

```javascript
// Login example
const response = await fetch("/api/auth/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: "user@example.com",
    password: "password123",
  }),
});

const data = await response.json();
if (response.ok) {
  localStorage.setItem("token", data.token);
  localStorage.setItem("refreshToken", data.refreshToken);
}
```

### Making Authenticated Requests

```javascript
const token = localStorage.getItem("token");

const response = await fetch("/api/task", {
  method: "GET",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});
```

### Task Operations

```javascript
// Create task
const createTask = async (taskData) => {
  const token = localStorage.getItem("token");

  const response = await fetch("/api/task/create", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(taskData),
  });

  return await response.json();
};

// Get all tasks
const getTasks = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch("/api/task", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return await response.json();
};
```

## 🔄 Development

### Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Start production server
npm start
```

### Database Seeding

The application automatically seeds roles (admin, user) on startup.

### Error Handling

- All routes include proper error handling
- Validation for required fields
- Authentication and authorization checks
- Database error handling

## 🧪 API Testing

You can test the API using tools like:

- **Postman** - Import the collection
- **curl** - Command line testing
- **Thunder Client** (VS Code extension)

### Example curl commands:

```bash
# Register
curl -X POST http://localhost:5500/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5500/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# Get tasks (replace YOUR_TOKEN with actual token)
curl -X GET http://localhost:5500/api/task \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🚀 Production Deployment

1. Set `NODE_ENV=production` in your environment
2. Use strong, unique JWT secrets
3. Configure MongoDB connection for production
4. Set up proper CORS configuration
5. Use HTTPS in production
6. Set up proper logging and monitoring

## 📝 Notes for Frontend Developers

- Store JWT tokens securely (consider httpOnly cookies for production)
- Implement token refresh logic for expired access tokens
- Handle different HTTP status codes appropriately
- Implement proper error handling and user feedback
- Consider implementing loading states for better UX
- The backend supports CORS, but you may need to configure it for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the ISC License.
