'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TaskItem from './TaskItem';
import LoadingSpinner from './LoadingSpinner';
import { Task } from '../utils/api';

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onToggleStatus: (taskId: string) => void;
  isLoading?: boolean;
}

export default function TaskList({ tasks, onEdit, onDelete, onToggleStatus, isLoading = false }: TaskListProps) {
  const [filters, setFilters] = useState({
    status: '',
    sortBy: 'createdAt',
    order: 'desc' as 'asc' | 'desc'
  });

  // Ensure tasks is an array and provide fallback
  const safeTasks = Array.isArray(tasks) ? tasks : [];
  
  // Ensure filters has proper fallback values
  const safeFilters = filters || { status: '', sortBy: 'createdAt', order: 'desc' as 'asc' | 'desc' };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSortChange = (sortBy: string) => {
    setFilters(prev => ({
      ...prev,
      sortBy,
      order: prev.sortBy === sortBy && prev.order === 'desc' ? 'asc' : 'desc'
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      sortBy: 'createdAt',
      order: 'desc'
    });
  };

  // Filter tasks
  let filteredTasks = [...safeTasks];
  
  if (safeFilters.status) {
    filteredTasks = filteredTasks.filter(task => task.status === safeFilters.status);
  }

  // Sort tasks
  filteredTasks.sort((a, b) => {
    let aValue: any, bValue: any;
    
    switch (safeFilters.sortBy) {
      case 'title':
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      case 'status':
        aValue = a.status;
        bValue = b.status;
        break;
      case 'updatedAt':
        aValue = new Date(a.updatedAt || a.createdAt);
        bValue = new Date(b.updatedAt || b.createdAt);
        break;
      default: // createdAt
        aValue = new Date(a.createdAt);
        bValue = new Date(b.createdAt);
    }

    if (safeFilters.order === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const hasActiveFilters = safeFilters.status || safeFilters.sortBy !== 'createdAt' || safeFilters.order !== 'desc';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="md" text="Loading tasks..." />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Filters and Sorting */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
          <div className="flex flex-wrap gap-4">
            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <label htmlFor="status-filter" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Status:
              </label>
              <select
                id="status-filter"
                value={safeFilters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="done">Done</option>
              </select>
            </div>

            {/* Sort By */}
            <div className="flex items-center gap-2">
              <label htmlFor="sort-by" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Sort by:
              </label>
              <select
                id="sort-by"
                value={safeFilters.sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400"
              >
                <option value="createdAt">Created Date</option>
                <option value="updatedAt">Updated Date</option>
                <option value="title">Title</option>
                <option value="status">Status</option>
              </select>
            </div>

            {/* Sort Order */}
            <button
              onClick={() => handleSortChange(safeFilters.sortBy)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 transition-colors"
              aria-label={`Sort ${safeFilters.order === 'asc' ? 'descending' : 'ascending'}`}
            >
              {safeFilters.order === 'asc' ? '↑' : '↓'}
            </button>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600">
            {filteredTasks.length} of {safeTasks.length} tasks
          </div>
        </div>
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
          <div className="text-gray-400 dark:text-gray-500 mb-6">
            <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">
            {hasActiveFilters ? 'No tasks match your filters' : 'No tasks yet'}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            {hasActiveFilters 
              ? 'Try adjusting your filters or create a new task to get started.'
              : 'Create your first task to get started with task management.'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <AnimatePresence>
            {filteredTasks.map((task) => (
              <motion.div
                key={task._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <TaskItem
                  task={task}
                  onToggleStatus={(id) => onToggleStatus(id)}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
