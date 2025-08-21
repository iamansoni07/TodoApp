'use client';
import { motion } from 'framer-motion';
import ClientOnly from './ClientOnly';
import LoadingSpinner from './LoadingSpinner';
import { Task } from '../utils/api';

interface DashboardStatsProps {
  tasks: Task[];
  isLoading?: boolean;
}

export default function DashboardStats({ tasks, isLoading = false }: DashboardStatsProps) {
  // Ensure tasks is an array and provide fallback
  const safeTasks = Array.isArray(tasks) ? tasks : [];
  
  if (isLoading) {
    return (
      <ClientOnly>
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" text="Loading statistics..." />
        </div>
      </ClientOnly>
    );
  }
  
  return (
    <ClientOnly>
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        data-section="dashboard-stats"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Task Overview
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Get a quick snapshot of your productivity
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <StatsContent tasks={safeTasks} />
        </div>
      </motion.div>
    </ClientOnly>
  );
}

function StatsContent({ tasks }: { tasks: Task[] }) {
  // Ensure we have valid data
  const safeTasks = Array.isArray(tasks) ? tasks : [];
  
  const totalTasks = safeTasks.length;
  const completedTasks = safeTasks.filter(task => task.status === 'done').length;
  const todoTasks = safeTasks.filter(task => task.status === 'todo').length;
  const inProgressTasks = safeTasks.filter(task => task.status === 'in-progress').length;
  
  // Ensure completion rate is always a valid number
  let completionRate = 0;
  if (totalTasks > 0) {
    completionRate = Math.round((completedTasks / totalTasks) * 100);
    // Ensure it's between 0 and 100
    completionRate = Math.max(0, Math.min(100, completionRate));
  }

  const stats = [
    {
      label: 'Total Tasks',
      value: totalTasks,
      icon: '📋',
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      darkBgColor: 'dark:bg-blue-900/20'
    },
    {
      label: 'To-Do',
      value: todoTasks,
      icon: '📝',
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      darkBgColor: 'dark:bg-blue-900/20'
    },
    {
      label: 'In Progress',
      value: inProgressTasks,
      icon: '⏳',
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      darkBgColor: 'dark:bg-yellow-900/20'
    },
    {
      label: 'Done',
      value: completedTasks,
      icon: '✅',
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
      darkBgColor: 'dark:bg-green-900/20'
    },
    {
      label: 'Completion Rate',
      value: `${completionRate}%`,
      icon: '📊',
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      darkBgColor: 'dark:bg-purple-900/20'
    }
  ];

  return (
    <>
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          className={`${stat.bgColor} ${stat.darkBgColor} rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 group`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
          whileHover={{ y: -5, scale: 1.02 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              {stat.icon}
            </div>
            <div className={`text-right ${stat.textColor} dark:text-white`}>
              <div className="text-3xl font-bold">{stat.value}</div>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {stat.label}
          </h3>
          <div className="flex items-center gap-2">
            {stat.label === 'Completion Rate' && (
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <motion.div
                  className={`${stat.color} h-2 rounded-full`}
                  initial={{ width: 0 }}
                  animate={{ width: `${completionRate}%` }}
                  transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                />
              </div>
            )}
            {stat.label === 'Total Tasks' && (
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {totalTasks > 0 ? 'Active project' : 'No tasks yet'}
              </span>
            )}
            {stat.label === 'Done' && (
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {completedTasks > 0 ? 'Great progress!' : 'Start completing tasks'}
              </span>
            )}
          </div>
        </motion.div>
      ))}
    </>
  );
}
