'use client';

import { useState } from 'react';
import { Task, TaskFilters } from '../utils/api';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  onToggleStatus: (id: string, status: 'pending' | 'done') => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  filters: TaskFilters;
  onFiltersChange: (filters: TaskFilters) => void;
}

export default function TaskList({ 
  tasks, 
  onToggleStatus, 
  onEdit, 
  onDelete, 
  filters, 
  onFiltersChange 
}: TaskListProps) {
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (key: keyof TaskFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const pendingCount = tasks.filter(task => task.status === 'pending').length;
  const completedCount = tasks.filter(task => task.status === 'done').length;

  return (
    <div className="space-y-6">
      {/* Task Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Tasks ({tasks.length})
          </h2>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            {showFilters ? 'Hide' : 'Show'} Filters
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{pendingCount}</div>
            <div className="text-blue-600 dark:text-blue-400">Pending</div>
          </div>
          <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{completedCount}</div>
            <div className="text-green-600 dark:text-green-400">Completed</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Filters & Sorting</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                id="status-filter"
                value={filters.status || ''}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="done">Done</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="sort-by" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sort By
              </label>
              <select
                id="sort-by"
                value={filters.sortBy || 'createdAt'}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="createdAt">Creation Date</option>
                <option value="title">Title</option>
                <option value="description">Description</option>
                <option value="status">Status</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="sort-order" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sort Order
              </label>
              <select
                id="sort-order"
                value={filters.sortOrder || 'desc'}
                onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>
          
          <div className="mt-4">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {/* Task List */}
      {tasks.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No tasks found</h3>
          <p className="text-gray-500 dark:text-gray-400">
            {filters.status || filters.sortBy ? 'Try adjusting your filters or create a new task.' : 'Get started by creating your first task!'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              onToggleStatus={onToggleStatus}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
