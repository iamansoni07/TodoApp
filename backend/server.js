require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

// Import middleware
const { errorHandler, notFound } = require('./middleware/errorHandler');
const { 
  helmetConfig, 
  corsOptions, 
  sanitizeInput, 
  requestLogger 
} = require('./middleware/security');

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Trust proxy for Render/behind-proxy deployments so IPs and secure cookies work properly
app.set('trust proxy', 1);

// Security middleware
app.use(helmetConfig);

// CORS configuration
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Custom request logger
app.use(requestLogger);

// Input sanitization
app.use(sanitizeInput);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
    uptime: process.uptime()
  });
});

// API routes
const taskRoutes = require('./routes/taskRoutes');
app.use('/api/tasks', taskRoutes);

// 404 handler for undefined routes
app.use(notFound);

// Global error handling middleware (must be last)
app.use(errorHandler);

// Database Connection with enhanced error handling
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // MongoDB connection options for better performance and reliability
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false
    });

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      // Log error without console.log
    });

    mongoose.connection.on('disconnected', () => {
      // Log disconnection without console.log
    });

    mongoose.connection.on('reconnected', () => {
      // Log reconnection without console.log
    });

  } catch (error) {
    process.exit(1);
  }
};

// Graceful shutdown handling
const gracefulShutdown = (signal) => {
  mongoose.connection.close(false, () => {
    process.exit(0);
  });
};

// Listen for shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Start the server
const startServer = async () => {
  try {
    // Connect to database first
    await connectDB();
    
    // Start server
    const server = app.listen(PORT, () => {
      // Server started successfully
    });

    // Handle server errors
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        process.exit(1);
      } else {
        // Handle other server errors
      }
    });

  } catch (error) {
    process.exit(1);
  }
};

// Start the application
startServer();