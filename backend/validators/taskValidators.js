const Joi = require('joi');

/**
 * Validation schema for creating a new task
 * @type {Joi.ObjectSchema}
 */
const createTaskSchema = Joi.object({
  title: Joi.string()
    .trim()
    .min(1)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Title is required',
      'string.min': 'Title must be at least 1 character long',
      'string.max': 'Title cannot exceed 100 characters',
      'any.required': 'Title is required'
    }),
  
  description: Joi.string()
    .trim()
    .min(1)
    .max(500)
    .required()
    .messages({
      'string.empty': 'Description is required',
      'string.min': 'Description must be at least 1 character long',
      'string.max': 'Description cannot exceed 500 characters',
      'any.required': 'Description is required'
    }),
  
  status: Joi.string()
    .valid('pending', 'done')
    .default('pending')
    .messages({
      'any.only': 'Status must be either "pending" or "done"'
    })
});

/**
 * Validation schema for updating an existing task
 * @type {Joi.ObjectSchema}
 */
const updateTaskSchema = Joi.object({
  title: Joi.string()
    .trim()
    .min(1)
    .max(100)
    .optional()
    .messages({
      'string.empty': 'Title cannot be empty',
      'string.min': 'Title must be at least 1 character long',
      'string.max': 'Title cannot exceed 100 characters'
    }),
  
  description: Joi.string()
    .trim()
    .min(1)
    .max(500)
    .optional()
    .messages({
      'string.empty': 'Description cannot be empty',
      'string.min': 'Description must be at least 1 character long',
      'string.max': 'Description cannot exceed 500 characters'
    }),
  
  status: Joi.string()
    .valid('pending', 'done')
    .optional()
    .messages({
      'any.only': 'Status must be either "pending" or "done"'
    })
});

/**
 * Validation schema for task query parameters (filtering and sorting)
 * @type {Joi.ObjectSchema}
 */
const taskQuerySchema = Joi.object({
  status: Joi.string()
    .valid('pending', 'done')
    .optional()
    .messages({
      'any.only': 'Status must be either "pending" or "done"'
    }),
  
  sortBy: Joi.string()
    .valid('title', 'description', 'status', 'createdAt')
    .default('createdAt')
    .optional()
    .messages({
      'any.only': 'Sort field must be one of: title, description, status, createdAt'
    }),
  
  sortOrder: Joi.string()
    .valid('asc', 'desc')
    .default('desc')
    .optional()
    .messages({
      'any.only': 'Sort order must be either "asc" or "desc"'
    }),
  
  page: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .optional()
    .messages({
      'number.base': 'Page must be a number',
      'number.integer': 'Page must be an integer',
      'number.min': 'Page number must be at least 1'
    }),
  
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(20)
    .optional()
    .messages({
      'number.base': 'Limit must be a number',
      'number.integer': 'Limit must be an integer',
      'number.min': 'Limit must be at least 1',
      'number.max': 'Limit cannot exceed 100'
    })
});

/**
 * Validation schema for task ID parameter
 * @type {Joi.ObjectSchema}
 */
const taskIdSchema = Joi.object({
  id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid task ID format',
      'any.required': 'Task ID is required'
    })
});

module.exports = {
  createTaskSchema,
  updateTaskSchema,
  taskQuerySchema,
  taskIdSchema
};
