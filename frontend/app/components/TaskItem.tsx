'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Task } from '../utils/api';
import ClientOnly from './ClientOnly';

interface TaskItemProps {
  task: Task;
  onToggleStatus: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export default function TaskItem({ task, onToggleStatus, onEdit, onDelete }: TaskItemProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleToggleStatus = () => {
    onToggleStatus(task._id);
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    onDelete(task._id);
    setShowDeleteConfirm(false);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <>
      <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 border-l-4 ${
        task.status === 'done'
          ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
          : task.status === 'in-progress'
            ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
            : 'border-blue-500 bg-blue-50/30 dark:bg-blue-900/10'
      }`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleStatus}
              className={`px-2 py-1 rounded text-xs font-medium border ${
                task.status === 'done' ? 'bg-green-100 text-green-800 border-green-300' :
                task.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                'bg-blue-100 text-blue-800 border-blue-300'
              }`}
              title="Cycle status"
            >
              {task.status === 'done' ? 'Done' : task.status === 'in-progress' ? 'In Progress' : 'To-Do'}
            </button>
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
              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors duration-200"
              title="Edit task"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={handleDelete}
              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors duration-200"
              title="Delete task"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
        
        <p className={`text-gray-700 dark:text-gray-300 mb-4 text-base leading-relaxed ${
          task.status === 'done' ? 'line-through' : ''
        }`}>
          {task.description}
        </p>
        
        <div className="flex items-center justify-between">
          <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${
            task.status === 'done'
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
              : task.status === 'in-progress'
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
          }`}>
            {task.status === 'done' ? 'Done' : task.status === 'in-progress' ? 'In Progress' : 'To-Do'}
          </span>
          <ClientOnly>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {task.dueDate ? `Due: ${formatDate(task.dueDate)}` : `Created: ${formatDate(task.createdAt)}`}
            </span>
          </ClientOnly>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", bounce: 0.3 }}
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Delete Task
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Are you sure you want to delete "{task.title}"? This action cannot be undone.
                </p>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 font-medium rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  Delete Task
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
