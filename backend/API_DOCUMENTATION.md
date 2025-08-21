# Todo API Documentation

## Overview
Professional Todo API built with Express.js, MongoDB, and comprehensive security features.

## Base URL
```
http://localhost:5000/api
```

## Authentication
Currently, the API is public. Future versions will include JWT authentication.

## Rate Limiting
- **General API**: 100 requests per 15 minutes per IP
- **Task Creation**: 20 requests per 15 minutes per IP

## Response Format
All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "data": {...},
  "message": "Operation successful",
  "pagination": {...} // when applicable
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [...] // validation errors when applicable
}
```

## Endpoints

### 1. Get All Tasks
```http
GET /api/tasks
```

**Query Parameters:**
- `status` (optional): Filter by status (`todo`, `in-progress`, or `done`)
- `sortBy` (optional): Sort field (`title`, `description`, `status`, `createdAt`)
- `sortOrder` (optional): Sort direction (`asc` or `desc`)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)

**Example:**
```http
GET /api/tasks?status=pending&sortBy=createdAt&sortOrder=desc&page=1&limit=10
```

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalCount": 50,
    "limit": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  },
  "filters": {
    "status": "pending",
    "sortBy": "createdAt",
    "sortOrder": "desc"
  }
}
```

### 2. Get Task Statistics
```http
GET /api/tasks/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 50,
    "todo": 30,
    "inProgress": 10,
    "completed": 10,
    "completionRate": 20
  }
}
```

### 3. Search Tasks
```http
GET /api/tasks/search?q=searchterm
```

**Query Parameters:**
- `q` (required): Search query (minimum 2 characters)
- Additional filters: same as Get All Tasks

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {...},
  "filters": {...},
  "search": {
    "query": "searchterm",
    "resultsCount": 5
  }
}
```

### 4. Get Single Task
```http
GET /api/tasks/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "60d21b4667d0d8992e610c85",
    "title": "Task Title",
    "description": "Task Description",
    "status": "todo",
    "createdAt": "2023-12-20T10:30:00.000Z"
  }
}
```

### 5. Create Task
```http
POST /api/tasks
```

**Request Body:**
```json
{
  "title": "Task Title",
  "description": "Task Description",
  "status": "todo" // optional, defaults to "todo"
}
```

**Validation Rules:**
- `title`: Required, 1-100 characters
- `description`: Required, 1-500 characters
- `status`: Optional, must be "todo", "in-progress" or "done"

**Response:**
```json
{
  "success": true,
  "data": {...},
  "message": "Task created successfully"
}
```

### 6. Update Task
```http
PUT /api/tasks/:id
```

**Request Body:**
```json
{
  "title": "Updated Title", // optional
  "description": "Updated Description", // optional
  "status": "done" // optional
}
```

**Response:**
```json
{
  "success": true,
  "data": {...},
  "message": "Task updated successfully"
}
```

### 7. Toggle Task Status
```http
PATCH /api/tasks/:id/toggle
```

**Response:**
```json
{
  "success": true,
  "data": {...},
  "message": "Task status changed to done"
}
```

### 8. Delete Task
```http
DELETE /api/tasks/:id
```

**Response:**
```json
{
  "success": true,
  "message": "Task deleted successfully",
  "data": {
    "id": "60d21b4667d0d8992e610c85"
  }
}
```

### 9. Bulk Operations
```http
POST /api/tasks/bulk
```

**Request Body:**
```json
{
  "operation": "delete", // "delete", "update", or "toggle"
  "taskIds": ["id1", "id2", "id3"],
  "data": {} // required for "update" operation
}
```

**Response:**
```json
{
  "success": true,
  "message": "Bulk operation completed. 2 successful, 1 failed.",
  "data": {
    "results": [...],
    "errors": [...],
    "summary": {
      "total": 3,
      "successful": 2,
      "failed": 1
    }
  }
}
```

## Health Check
```http
GET /health
```

**Response:**
```json
{
  "success": true,
  "message": "Server is healthy",
  "timestamp": "2023-12-20T10:30:00.000Z",
  "environment": "development",
  "uptime": 123.456
}
```

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (Validation Error) |
| 404 | Not Found |
| 409 | Conflict (Duplicate Resource) |
| 429 | Too Many Requests (Rate Limited) |
| 500 | Internal Server Error |

## Validation Errors
When validation fails, the API returns detailed error information:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "title",
      "message": "Title is required"
    },
    {
      "field": "description",
      "message": "Description must be at least 1 character long"
    }
  ]
}
```

## Security Features

### Input Sanitization
- XSS prevention
- Script tag removal
- JavaScript protocol blocking
- Event handler removal

### Rate Limiting
- IP-based rate limiting
- Different limits for different operations
- Standard rate limit headers

### CORS Protection
- Configurable allowed origins
- Secure defaults for production

### Helmet Security
- Content Security Policy
- XSS Protection
- Frame protection
- Content type sniffing prevention

## Performance Features

### Database Optimization
- Connection pooling
- Query optimization with lean()
- Parallel query execution
- Proper indexing

### Response Optimization
- Pagination support
- Efficient filtering and sorting
- Response compression (production)

## Development vs Production

### Development
- Detailed error messages
- Stack traces
- Morgan logging
- CORS for localhost

### Production
- Sanitized error messages
- No stack traces
- Structured logging
- Restricted CORS origins
- Enhanced security headers

## Monitoring and Logging

### Request Logging
- Request method and URL
- Response status and duration
- User agent and IP address
- Timestamp

### Error Logging
- Error details with context
- Request information
- Stack traces (development only)
- Structured error format

## Future Enhancements

### Planned Features
- JWT Authentication
- User management
- Task categories and tags
- File attachments
- Real-time notifications
- Advanced search with Elasticsearch
- API versioning
- Webhook support
- Bulk import/export

### Performance Improvements
- Redis caching
- Database query optimization
- Response compression
- CDN integration
- Load balancing support
