'use client';

import { Task, UpdateTaskData } from '../utils/api';

interface TaskItemProps {
  task: Task;
  onToggleStatus: (id: string, status: 'pending' | 'done') => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export default function TaskItem({ task, onToggleStatus, onEdit, onDelete }: TaskItemProps) {
  const handleToggleStatus = () => {
    const newStatus = task.status === 'pending' ? 'done' : 'pending';
    onToggleStatus(task._id, newStatus);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDelete(task._id);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 ${
      task.status === 'done' 
        ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
        : 'border-blue-500'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={task.status === 'done'}
            onChange={handleToggleStatus}
            aria-label={`Mark task as ${task.status === 'done' ? 'pending' : 'done'}`}
            className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2"
          />
          <h3 className={`text-lg font-semibold ${
            task.status === 'done' 
              ? 'text-gray-500 line-through' 
              : 'text-gray-900 dark:text-white'
          }`}>
            {task.title}
          </h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(task)}
            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-md transition-colors duration-200"
            title="Edit task"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-md transition-colors duration-200"
            title="Delete task"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      
      <p className={`text-gray-700 dark:text-gray-300 mb-4 ${
        task.status === 'done' ? 'line-through' : ''
      }`}>
        {task.description}
      </p>
      
      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          task.status === 'done'
            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
            : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
        }`}>
          {task.status === 'done' ? 'Completed' : 'Pending'}
        </span>
        <span>Created: {formatDate(task.createdAt)}</span>
      </div>
    </div>
  );
}
