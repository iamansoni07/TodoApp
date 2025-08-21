const Task = require('../models/Task');
const { AppError } = require('../middleware/errorHandler');

/**
 * Task Service Class
 * Handles all business logic related to tasks
 */
class TaskService {
  /**
   * Get all tasks with filtering, sorting, and pagination
   * @param {Object} filters - Filter options
   * @param {string} filters.status - Task status filter
   * @param {string} filters.sortBy - Sort field
   * @param {string} filters.sortOrder - Sort direction
   * @param {number} filters.page - Page number
   * @param {number} filters.limit - Items per page
   * @returns {Promise<Object>} Tasks and metadata
   */
  async getTasks(filters = {}) {
    const {
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 20
    } = filters;

    // Build filter object
    const filter = {};
    if (status && ['todo', 'in-progress', 'done'].includes(status)) {
      filter.status = status;
    }

    // Build sort object
    const sort = {};
    const validSortFields = ['title', 'description', 'status', 'createdAt'];
    if (validSortFields.includes(sortBy)) {
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    } else {
      sort.createdAt = -1; // Default sort by creation date descending
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    try {
      // Execute queries in parallel for better performance
      const [tasks, totalCount] = await Promise.all([
        Task.find(filter)
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .lean(), // Use lean() for better performance when not modifying documents
        Task.countDocuments(filter)
      ]);

      // Calculate pagination metadata
      const totalPages = Math.ceil(totalCount / limit);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;

      return {
        success: true,
        data: tasks,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          limit,
          hasNextPage,
          hasPrevPage
        },
        filters: {
          status: status || 'all',
          sortBy,
          sortOrder
        }
      };
    } catch (error) {
      throw new AppError('Failed to fetch tasks', 500);
    }
  }

  /**
   * Get a single task by ID
   * @param {string} taskId - Task ID
   * @returns {Promise<Object>} Task object
   */
  async getTaskById(taskId) {
    try {
      const task = await Task.findById(taskId).lean();
      
      if (!task) {
        throw new AppError('Task not found', 404);
      }

      return {
        success: true,
        data: task
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to fetch task', 500);
    }
  }

  /**
   * Create a new task
   * @param {Object} taskData - Task data
   * @param {string} taskData.title - Task title
   * @param {string} taskData.description - Task description
   * @param {string} taskData.status - Task status
   * @returns {Promise<Object>} Created task
   */
  async createTask(taskData) {
    try {
      const { title, description, status = 'todo', dueDate } = taskData;

      // Check if task with same title already exists (case-insensitive)
      const existingTask = await Task.findOne({
        title: { $regex: new RegExp(`^${title}$`, 'i') }
      });

      if (existingTask) {
        throw new AppError('A task with this title already exists', 409);
      }

      const task = new Task({
        title: title.trim(),
        description: description.trim(),
        status,
        dueDate: dueDate ? new Date(dueDate) : null
      });

      const savedTask = await task.save();

      return {
        success: true,
        data: savedTask,
        message: 'Task created successfully'
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to create task', 500);
    }
  }

  /**
   * Update an existing task
   * @param {string} taskId - Task ID
   * @param {Object} updateData - Update data
   * @returns {Promise<Object>} Updated task
   */
  async updateTask(taskId, updateData) {
    try {
      const { title, description, status, dueDate } = updateData;

      // Check if task exists
      const existingTask = await Task.findById(taskId);
      if (!existingTask) {
        throw new AppError('Task not found', 404);
      }

      // If updating title, check for duplicates
      if (title && title !== existingTask.title) {
        const duplicateTask = await Task.findOne({
          title: { $regex: new RegExp(`^${title}$`, 'i') },
          _id: { $ne: taskId }
        });

        if (duplicateTask) {
          throw new AppError('A task with this title already exists', 409);
        }
      }

      // Build update object with only provided fields
      const updateObject = {};
      if (title !== undefined) updateObject.title = title.trim();
      if (description !== undefined) updateObject.description = description.trim();
      if (status !== undefined) updateObject.status = status;
      if (dueDate !== undefined) updateObject.dueDate = dueDate ? new Date(dueDate) : null;

      const updatedTask = await Task.findByIdAndUpdate(
        taskId,
        updateObject,
        { 
          new: true, 
          runValidators: true,
          lean: true
        }
      );

      return {
        success: true,
        data: updatedTask,
        message: 'Task updated successfully'
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to update task', 500);
    }
  }

  /**
   * Delete a task
   * @param {string} taskId - Task ID
   * @returns {Promise<Object>} Deletion result
   */
  async deleteTask(taskId) {
    try {
      const deletedTask = await Task.findByIdAndDelete(taskId);
      
      if (!deletedTask) {
        throw new AppError('Task not found', 404);
      }

      return {
        success: true,
        message: 'Task deleted successfully',
        data: { id: taskId }
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to delete task', 500);
    }
  }

  /**
   * Toggle task status
   * @param {string} taskId - Task ID
   * @returns {Promise<Object>} Updated task
   */
  async toggleTaskStatus(taskId) {
    try {
      const task = await Task.findById(taskId);
      
      if (!task) {
        throw new AppError('Task not found', 404);
      }

      // toggle through three states: todo -> in-progress -> done -> todo
      const nextStatusMap = { 'todo': 'in-progress', 'in-progress': 'done', 'done': 'todo' };
      const newStatus = nextStatusMap[task.status] || 'todo';
      const updatedTask = await Task.findByIdAndUpdate(
        taskId,
        { status: newStatus },
        { new: true, lean: true }
      );

      return {
        success: true,
        data: updatedTask,
        message: `Task status changed to ${newStatus}`
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to toggle task status', 500);
    }
  }

  /**
   * Get task statistics
   * @returns {Promise<Object>} Task statistics
   */
  async getTaskStats() {
    try {
      const [totalTasks, todoTasks, inProgressTasks, completedTasks] = await Promise.all([
        Task.countDocuments(),
        Task.countDocuments({ status: 'todo' }),
        Task.countDocuments({ status: 'in-progress' }),
        Task.countDocuments({ status: 'done' })
      ]);

      const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      return {
        success: true,
        data: {
          total: totalTasks,
          todo: todoTasks,
          inProgress: inProgressTasks,
          completed: completedTasks,
          completionRate
        }
      };
    } catch (error) {
      throw new AppError('Failed to fetch task statistics', 500);
    }
  }
}

module.exports = new TaskService();
