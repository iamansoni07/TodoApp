const express = require('express');
const router = express.Router();

// Import controllers and middleware
const taskController = require('../controllers/taskController');
const { validate, validateQuery, validateParams } = require('../middleware/validation');
const { taskCreationLimit, apiLimit } = require('../middleware/security');
const { createTaskSchema, updateTaskSchema, taskQuerySchema, taskIdSchema } = require('../validators/taskValidators');

/**
 * @route   GET /api/tasks
 * @desc    Get all tasks with filtering, sorting, and pagination
 * @access  Public
 */
router.get('/', 
  apiLimit,
  validateQuery(taskQuerySchema),
  taskController.getTasks
);

/**
 * @route   GET /api/tasks/stats
 * @desc    Get task statistics
 * @access  Public
 */
router.get('/stats',
  apiLimit,
  taskController.getTaskStats
);

/**
 * @route   GET /api/tasks/search
 * @desc    Search tasks by text
 * @access  Public
 */
router.get('/search',
  apiLimit,
  validateQuery(taskQuerySchema),
  taskController.searchTasks
);

/**
 * @route   GET /api/tasks/:id
 * @desc    Get a single task by ID
 * @access  Public
 */
router.get('/:id',
  apiLimit,
  validateParams(taskIdSchema),
  taskController.getTaskById
);

/**
 * @route   POST /api/tasks
 * @desc    Create a new task
 * @access  Public
 */
router.post('/',
  taskCreationLimit,
  validate(createTaskSchema),
  taskController.createTask
);

/**
 * @route   PUT /api/tasks/:id
 * @desc    Update an existing task
 * @access  Public
 */
router.put('/:id',
  apiLimit,
  validateParams(taskIdSchema),
  validate(updateTaskSchema),
  taskController.updateTask
);

/**
 * @route   PATCH /api/tasks/:id/toggle
 * @desc    Toggle task status
 * @access  Public
 */
router.patch('/:id/toggle',
  apiLimit,
  validateParams(taskIdSchema),
  taskController.toggleTaskStatus
);

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Delete a task
 * @access  Public
 */
router.delete('/:id',
  apiLimit,
  validateParams(taskIdSchema),
  taskController.deleteTask
);

/**
 * @route   POST /api/tasks/bulk
 * @desc    Perform bulk operations on tasks
 * @access  Public
 */
router.post('/bulk',
  apiLimit,
  taskController.bulkOperations
);

module.exports = router;