const taskService = require('../services/taskService');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * Task Controller
 * Handles HTTP requests and responses for task operations
 */
class TaskController {
  /**
   * Get all tasks with filtering, sorting, and pagination
   * @route GET /api/tasks
   * @access Public
   */
  getTasks = asyncHandler(async (req, res) => {
    const result = await taskService.getTasks(req.query);
    
    res.status(200).json(result);
  });

  /**
   * Get a single task by ID
   * @route GET /api/tasks/:id
   * @access Public
   */
  getTaskById = asyncHandler(async (req, res) => {
    const result = await taskService.getTaskById(req.params.id);
    
    res.status(200).json(result);
  });

  /**
   * Create a new task
   * @route POST /api/tasks
   * @access Public
   */
  createTask = asyncHandler(async (req, res) => {
    const result = await taskService.createTask(req.body);
    
    res.status(201).json(result);
  });

  /**
   * Update an existing task
   * @route PUT /api/tasks/:id
   * @access Public
   */
  updateTask = asyncHandler(async (req, res) => {
    const result = await taskService.updateTask(req.params.id, req.body);
    
    res.status(200).json(result);
  });

  /**
   * Delete a task
   * @route DELETE /api/tasks/:id
   * @access Public
   */
  deleteTask = asyncHandler(async (req, res) => {
    const result = await taskService.deleteTask(req.params.id);
    
    res.status(200).json(result);
  });

  /**
   * Toggle task status
   * @route PATCH /api/tasks/:id/toggle
   * @access Public
   */
  toggleTaskStatus = asyncHandler(async (req, res) => {
    const result = await taskService.toggleTaskStatus(req.params.id);
    
    res.status(200).json(result);
  });

  /**
   * Get task statistics
   * @route GET /api/tasks/stats
   * @access Public
   */
  getTaskStats = asyncHandler(async (req, res) => {
    const result = await taskService.getTaskStats();
    
    res.status(200).json(result);
  });

  /**
   * Bulk operations on tasks
   * @route POST /api/tasks/bulk
   * @access Public
   */
  bulkOperations = asyncHandler(async (req, res) => {
    const { operation, taskIds, data } = req.body;

    if (!operation || !taskIds || !Array.isArray(taskIds)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid bulk operation request'
      });
    }

    let results = [];
    let errors = [];

    // Process each task ID
    for (const taskId of taskIds) {
      try {
        let result;
        
        switch (operation) {
          case 'delete':
            result = await taskService.deleteTask(taskId);
            break;
          case 'update':
            result = await taskService.updateTask(taskId, data);
            break;
          case 'toggle':
            result = await taskService.toggleTaskStatus(taskId);
            break;
          default:
            throw new Error(`Unknown operation: ${operation}`);
        }
        
        results.push({ taskId, success: true, data: result });
      } catch (error) {
        errors.push({ 
          taskId, 
          success: false, 
          error: error.message 
        });
      }
    }

    const successCount = results.length;
    const errorCount = errors.length;

    res.status(200).json({
      success: true,
      message: `Bulk operation completed. ${successCount} successful, ${errorCount} failed.`,
      data: {
        results,
        errors,
        summary: {
          total: taskIds.length,
          successful: successCount,
          failed: errorCount
        }
      }
    });
  });

  /**
   * Search tasks by text
   * @route GET /api/tasks/search
   * @access Public
   */
  searchTasks = asyncHandler(async (req, res) => {
    const { q: searchQuery, ...filters } = req.query;

    if (!searchQuery || searchQuery.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters long'
      });
    }

    // Add search functionality to the service layer
    const searchFilters = {
      ...filters,
      search: searchQuery.trim()
    };

    const result = await taskService.getTasks(searchFilters);
    
    res.status(200).json({
      ...result,
      search: {
        query: searchQuery.trim(),
        resultsCount: result.data.length
      }
    });
  });
}

module.exports = new TaskController();
