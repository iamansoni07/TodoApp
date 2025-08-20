'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from './components/Layout';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import DashboardStats from './components/DashboardStats';
import QuickActions from './components/QuickActions';
import ClientOnly from './components/ClientOnly';
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask, useToggleTaskStatus } from './hooks/useTasks';
import { Task } from './utils/api';
import LoadingSpinner from './components/LoadingSpinner';

export default function HomePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);

  // React Query hooks
  const { data: tasks = [], isLoading, error } = useTasks();
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();
  const toggleStatusMutation = useToggleTaskStatus();

  // Ensure tasks is an array and provide fallback
  const safeTasks = Array.isArray(tasks) ? tasks : [];

  const showErrorToast = (message: string) => {
    setErrorMessage(message);
    setShowError(true);
    setTimeout(() => setShowError(false), 5000);
  };

  const handleCreateTask = (data: any) => {
    createTaskMutation.mutate(data, {
      onSuccess: () => {
        // Reset all form state
        setShowForm(false);
        setIsEditing(false);
        setEditingTask(null);
      },
      onError: (error) => {
        showErrorToast(`Failed to create task: ${error.message || 'Unknown error occurred'}`);
      }
    });
  };

  const handleUpdateTask = (data: any) => {
    if (editingTask) {
      updateTaskMutation.mutate({ id: editingTask._id, data }, {
        onSuccess: () => {
          // Reset all form state
          setIsEditing(false);
          setEditingTask(null);
          setShowForm(false);
        },
        onError: (error) => {
          showErrorToast(`Failed to update task: ${error.message || 'Unknown error occurred'}`);
        }
      });
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTaskMutation.mutate(taskId, {
      onSuccess: () => {
        // Task deleted successfully
      },
      onError: (error) => {
        showErrorToast(`Failed to delete task: ${error.message || 'Unknown error occurred'}`);
      }
    });
  };

  const handleToggleStatus = (taskId: string) => {
    toggleStatusMutation.mutate(taskId, {
      onSuccess: () => {
        // Task status toggled successfully
      },
      onError: (error) => {
        showErrorToast(`Failed to toggle task status: ${error.message || 'Unknown error occurred'}`);
      }
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingTask(null);
    setShowForm(false);
  };

  return (
    <Layout>
      <div className="space-y-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <ClientOnly>
          <motion.div
            className="text-center mb-16 pt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Task Dashboard
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Manage your tasks efficiently with our professional task management system
            </p>
          </motion.div>
        </ClientOnly>

        {/* Dashboard Stats */}
        <div className="mb-16">
          <DashboardStats tasks={safeTasks} isLoading={isLoading} />
        </div>

        {/* Quick Actions */}
        <div className="mb-16">
          <QuickActions 
            onCreateTask={() => setShowForm(true)}
            onBulkImport={() => {/* TODO: Implement bulk import */}}
            onExportTasks={() => {/* TODO: Implement export */}}
          />
        </div>

        {/* Task Form Section */}
        <ClientOnly>
          <AnimatePresence>
            {showForm && (
              <motion.div
                className="mb-16"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <TaskForm
                  onSubmit={isEditing ? handleUpdateTask : handleCreateTask}
                  task={editingTask}
                  isEditing={isEditing}
                  onCancel={handleCancelEdit}
                  isLoading={createTaskMutation.isPending || updateTaskMutation.isPending}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </ClientOnly>

        {/* Task List Section */}
        <ClientOnly>
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Your Tasks
                </h2>
                {!showForm && (
                  <motion.button
                    onClick={() => setShowForm(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Task
                  </motion.button>
                )}
              </div>
            </div>

            <div className="p-8">
              {error && (
                <motion.div
                  className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                        Error loading tasks
                      </h3>
                      <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                        {error.message || 'Failed to load tasks. Please try again.'}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <LoadingSpinner size="md" text="Loading tasks..." />
                </div>
              ) : (
                <TaskList
                  tasks={safeTasks}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                  onToggleStatus={handleToggleStatus}
                  isLoading={false}
                />
              )}
            </div>
          </motion.div>
        </ClientOnly>

        {/* Error Toast */}
        <ClientOnly>
          <AnimatePresence>
            {showError && (
              <motion.div
                className="fixed bottom-6 right-6 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 max-w-sm"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm">{errorMessage}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </ClientOnly>

        {/* Mutation Loading/Error Toasts */}
        <ClientOnly>
          <AnimatePresence>
            {(createTaskMutation.isPending || updateTaskMutation.isPending || deleteTaskMutation.isPending || toggleStatusMutation.isPending) && (
              <motion.div
                className="fixed bottom-6 right-6 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg z-50"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Processing...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {createTaskMutation.isError && (
              <motion.div
                className="fixed bottom-6 right-6 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Failed to create task</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </ClientOnly>
    </div>
    </Layout>
  );
}
