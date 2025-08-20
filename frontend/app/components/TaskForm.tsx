'use client';

import { useState, useEffect } from 'react';
import { Task, CreateTaskData, UpdateTaskData } from '../utils/api';

interface TaskFormProps {
  onSubmit: (taskData: CreateTaskData | UpdateTaskData) => void;
  task?: Task | null;
  isEditing?: boolean;
  onCancel?: () => void;
}

export default function TaskForm({ onSubmit, task, isEditing = false, onCancel }: TaskFormProps) {
  const [formData, setFormData] = useState<CreateTaskData>({
    title: '',
    description: '',
    status: 'pending'
  });

  useEffect(() => {
    if (task && isEditing) {
      setFormData({
        title: task.title,
        description: task.description,
        status: task.status
      });
    }
  }, [task, isEditing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title.trim() && formData.description.trim()) {
      onSubmit(formData);
      if (!isEditing) {
        setFormData({ title: '', description: '', status: 'pending' });
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        {isEditing ? 'Edit Task' : 'Create New Task'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Enter task title"
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Enter task description"
          />
        </div>
        
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="pending">Pending</option>
            <option value="done">Done</option>
          </select>
        </div>
        
        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {isEditing ? 'Update Task' : 'Create Task'}
          </button>
          {isEditing && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
