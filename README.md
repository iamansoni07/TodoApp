# Todo App - Full Stack MERN Application

A modern, responsive Todo application built with the MERN stack (MongoDB, Express.js, React/Next.js, Node.js) featuring a clean UI and comprehensive task management capabilities.

## 🚀 Features

### Core Functionality
- **Create Tasks**: Add new tasks with title and description
- **Read Tasks**: View all tasks with real-time updates
- **Update Tasks**: Edit task details and toggle completion status
- **Delete Tasks**: Remove tasks with confirmation prompts
- **Real-time Updates**: Automatic refresh after CRUD operations

### Bonus Features
- **Task Filtering**: Filter tasks by status (pending/done)
- **Advanced Sorting**: Sort tasks by title, description, status, or creation date
- **Sort Order Control**: Ascending or descending sort options
- **Task Statistics**: Visual summary of pending vs completed tasks
- **Responsive Design**: Mobile-first design with dark mode support

### User Experience
- **Modern UI**: Clean, professional interface using Tailwind CSS
- **Dark Mode**: Built-in dark/light theme support
- **Loading States**: Smooth loading indicators and error handling
- **Confirmation Dialogs**: Safe deletion with user confirmation
- **Accessibility**: ARIA labels and keyboard navigation support

## 🛠️ Tech Stack

### Backend
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **CORS**: Cross-origin resource sharing
- **dotenv**: Environment variable management

### Frontend
- **Next.js 15**: React framework with App Router
- **React 19**: User interface library
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client for API requests

## 📁 Project Structure

```
TodoApp/
├── backend/                 # Backend server
│   ├── models/             # Database models
│   │   └── Task.js        # Task schema and model
│   ├── routes/             # API routes
│   │   └── taskRoutes.js  # Task CRUD endpoints
│   ├── server.js           # Express server setup
│   └── package.json        # Backend dependencies
├── frontend/               # Next.js frontend
│   ├── app/                # App Router directory
│   │   ├── components/     # React components
│   │   │   ├── TaskForm.tsx    # Task creation/editing form
│   │   │   ├── TaskItem.tsx    # Individual task display
│   │   │   └── TaskList.tsx    # Task list with filters
│   │   ├── utils/          # Utility functions
│   │   │   └── api.ts      # API integration layer
│   │   ├── page.tsx        # Main application page
│   │   └── layout.tsx      # App layout wrapper
│   └── package.json        # Frontend dependencies
└── README.md               # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Configuration:**
   Create a `.env` file in the backend directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/todoapp
   PORT=5000
   ```
   
   **Note:** Replace the MongoDB URI with your actual connection string if using MongoDB Atlas or a different setup.

4. **Start the server:**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

   The backend will be available at `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:3000`

## 📱 Usage

### Creating Tasks
1. Fill in the task title and description
2. Select the initial status (defaults to "pending")
3. Click "Create Task" to save

### Managing Tasks
- **Toggle Status**: Click the checkbox to mark tasks as complete/incomplete
- **Edit Task**: Click the edit icon to modify task details
- **Delete Task**: Click the delete icon and confirm deletion

### Filtering and Sorting
- **Show Filters**: Click "Show Filters" to access filtering options
- **Status Filter**: Filter tasks by pending or completed status
- **Sort Options**: Sort by title, description, status, or creation date
- **Sort Order**: Choose ascending or descending order
- **Clear Filters**: Reset all filters to default settings

## 🔧 API Endpoints

### Base URL: `http://localhost:5000/api/tasks`

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| GET | `/` | Get all tasks | Query params: `status`, `sortBy`, `sortOrder` |
| POST | `/` | Create new task | `{ title, description, status? }` |
| PUT | `/:id` | Update task | `{ title?, description?, status? }` |
| DELETE | `/:id` | Delete task | None |

### Query Parameters
- `status`: Filter by task status (`pending` or `done`)
- `sortBy`: Sort field (`title`, `description`, `status`, `createdAt`)
- `sortOrder`: Sort direction (`asc` or `desc`)

## 🎨 UI Components

### TaskForm
- Reusable form for creating and editing tasks
- Form validation and error handling
- Responsive design with proper labels

### TaskItem
- Individual task display with status indicators
- Action buttons for edit and delete operations
- Visual feedback for completed tasks

### TaskList
- Task collection with filtering and sorting
- Task statistics dashboard
- Empty state handling

## 🌟 Key Features Implementation

### Backend Enhancements
- **Filtering**: Query parameter support for status-based filtering
- **Sorting**: Dynamic sorting by multiple fields with order control
- **Error Handling**: Comprehensive error responses and validation
- **CORS**: Cross-origin support for frontend integration

### Frontend Features
- **State Management**: React hooks for local state management
- **API Integration**: Centralized API layer with TypeScript interfaces
- **Real-time Updates**: Automatic refresh after CRUD operations
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark Mode**: Built-in theme support

## 🚀 Deployment

### Backend Deployment
- Deploy to platforms like Heroku, Railway, or DigitalOcean
- Set environment variables for production
- Use MongoDB Atlas for cloud database

### Frontend Deployment
- Build the application: `npm run build`
- Deploy to Vercel, Netlify, or any static hosting service
- Update API base URL for production backend

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

For issues and questions:
1. Check the existing issues
2. Create a new issue with detailed description
3. Include error logs and reproduction steps

---

**Built with ❤️ using the MERN stack**
