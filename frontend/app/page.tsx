'use client';

import { useState, useEffect } from 'react';
import { Task, CreateTaskData, UpdateTaskData, TaskFilters, createTask, getTasks, updateTask, deleteTask } from './utils/api';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filters, setFilters] = useState<TaskFilters>({});

  // Fetch tasks on component mount and when filters change
  useEffect(() => {
    fetchTasks();
  }, [filters]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedTasks = await getTasks(filters);
      setTasks(fetchedTasks);
    } catch (err) {
      setError('Failed to fetch tasks. Please try again.');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData: CreateTaskData) => {
    try {
      setError(null);
      await createTask(taskData);
      await fetchTasks(); // Refresh the task list
    } catch (err) {
      setError('Failed to create task. Please try again.');
      console.error('Error creating task:', err);
    }
  };

  const handleUpdateTask = async (taskData: UpdateTaskData) => {
    if (!editingTask) return;
    
    try {
      setError(null);
      await updateTask(editingTask._id, taskData);
      setEditingTask(null);
      await fetchTasks(); // Refresh the task list
    } catch (err) {
      setError('Failed to update task. Please try again.');
      console.error('Error updating task:', err);
    }
  };

  const handleToggleStatus = async (id: string, status: 'pending' | 'done') => {
    try {
      setError(null);
      await updateTask(id, { status });
      await fetchTasks(); // Refresh the task list
    } catch (err) {
      setError('Failed to update task status. Please try again.');
      console.error('Error updating task status:', err);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      setError(null);
      await deleteTask(id);
      await fetchTasks(); // Refresh the task list
    } catch (err) {
      setError('Failed to delete task. Please try again.');
      console.error('Error deleting task:', err);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  const handleFiltersChange = (newFilters: TaskFilters) => {
    setFilters(newFilters);
  };

  if (loading && tasks.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Todo App
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Organize your tasks efficiently with our powerful todo application
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-md mb-6">
            {error}
            <button
              onClick={() => setError(null)}
              className="float-right text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            >
              ×
            </button>
          </div>
        )}

        {/* Task Form */}
        {editingTask ? (
          <TaskForm
            onSubmit={handleUpdateTask}
            task={editingTask}
            isEditing={true}
            onCancel={handleCancelEdit}
          />
        ) : (
          <TaskForm onSubmit={handleCreateTask} />
        )}

        {/* Task List */}
        <TaskList
          tasks={tasks}
          onToggleStatus={handleToggleStatus}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />

        {/* Loading indicator for subsequent operations */}
        {loading && tasks.length > 0 && (
          <div className="text-center py-4">
            <div className="inline-flex items-center text-gray-600 dark:text-gray-400">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              Updating...
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
