# 🚀 Quick Start Guide

Get your Todo App up and running in minutes!

## Prerequisites
- Node.js (v18 or higher)
- MongoDB running locally or MongoDB Atlas account
- npm or yarn package manager

## ⚡ Quick Setup

### 1. Install All Dependencies
```bash
npm run install-all
```

### 2. Configure MongoDB
Create a `.env` file in the `backend` folder:
```env
MONGODB_URI=mongodb://localhost:27017/todoapp
PORT=5000
```

**For MongoDB Atlas users:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/todoapp
PORT=5000
```

### 3. Start Both Servers
```bash
npm run dev
```

This will start:
- Backend server at `http://localhost:5000`
- Frontend server at `http://localhost:3000`

### 4. Open Your Browser
Navigate to `http://localhost:3000` and start using your Todo App!

## 🔧 Manual Setup (Alternative)

### Backend Only
```bash
cd backend
npm install
npm run dev
```

### Frontend Only
```bash
cd frontend
npm install
npm run dev
```

## 🗄️ MongoDB Setup

### Local MongoDB
1. Install MongoDB Community Edition
2. Start MongoDB service
3. Create database: `todoapp`

### MongoDB Atlas (Cloud)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get connection string
4. Replace `username`, `password`, and `cluster` in your `.env` file

## 🚨 Troubleshooting

### Backend Issues
- Check if MongoDB is running
- Verify `.env` file exists and has correct values
- Ensure port 5000 is not in use

### Frontend Issues
- Check if backend is running on port 5000
- Verify all dependencies are installed
- Check browser console for errors

### Common Errors
- **"MongoDB connection error"**: Check MongoDB URI and network
- **"Port already in use"**: Change port in `.env` file
- **"Module not found"**: Run `npm install` in respective directories

## 📱 Test the App

1. **Create a task**: Fill the form and click "Create Task"
2. **Toggle status**: Click the checkbox to mark as complete
3. **Edit task**: Click the edit icon to modify details
4. **Delete task**: Click the delete icon and confirm
5. **Filter tasks**: Use the filter options to sort and filter

## 🎯 Next Steps

- Customize the UI colors and styling
- Add user authentication
- Implement task categories
- Add due dates and reminders
- Deploy to production

---

**Need help?** Check the main [README.md](README.md) for detailed documentation.
