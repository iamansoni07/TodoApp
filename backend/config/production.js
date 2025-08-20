/**
 * Production environment configuration
 */
module.exports = {
  // Server Configuration
  port: process.env.PORT || 5000,
  nodeEnv: 'production',
  
  // MongoDB Configuration
  mongodb: {
    uri: process.env.MONGODB_URI,
    options: {
      maxPoolSize: 20,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferMaxEntries: 0,
      bufferCommands: false
    }
  },
  
  // Security Configuration
  security: {
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      taskCreationLimit: 20 // more restrictive for task creation
    },
    cors: {
      allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || [
        'https://yourdomain.com',
        'https://www.yourdomain.com'
      ]
    },
    helmet: {
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
          connectSrc: ["'self'"],
          fontSrc: ["'self'"],
          objectSrc: ["'none'"],
          mediaSrc: ["'self'"],
          frameSrc: ["'none'"]
        }
      }
    }
  },
  
  // Logging Configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: 'combined',
    enableMorgan: true
  },
  
  // Performance Configuration
  performance: {
    bodyLimit: '10mb',
    timeout: 30000,
    compression: true
  }
};
