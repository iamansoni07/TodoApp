'use client';
import { motion } from 'framer-motion';
import ClientOnly from './ClientOnly';

interface QuickActionsProps {
  onCreateTask: () => void;
  onBulkImport: () => void;
  onExportTasks: () => void;
}

export default function QuickActions({ onCreateTask, onBulkImport, onExportTasks }: QuickActionsProps) {
  const actions = [
    {
      label: 'Create Task',
      description: 'Add a new task to your list',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
      action: onCreateTask,
      color: 'bg-blue-600 hover:bg-blue-700',
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      darkBgColor: 'dark:bg-blue-900/20'
    },
    {
      label: 'Bulk Import',
      description: 'Import multiple tasks at once',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      ),
      action: onBulkImport,
      color: 'bg-green-600 hover:bg-green-700',
      iconColor: 'text-green-600',
      bgColor: 'bg-green-50',
      darkBgColor: 'dark:bg-green-900/20'
    },
    {
      label: 'Export Tasks',
      description: 'Download your tasks as CSV/JSON',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      action: onExportTasks,
      color: 'bg-purple-600 hover:bg-purple-700',
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      darkBgColor: 'dark:bg-purple-900/20'
    }
  ];

  return (
    <ClientOnly>
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="px-8 py-8 border-b border-gray-200 dark:border-gray-700">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Quick Actions
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Get things done faster with these quick actions
            </p>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {actions.map((action, index) => (
              <motion.button
                key={action.label}
                onClick={action.action}
                className={`${action.bgColor} ${action.darkBgColor} p-8 rounded-xl border border-gray-200 dark:border-gray-700 text-left hover:shadow-lg transition-all duration-300 group`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={`w-14 h-14 ${action.bgColor} ${action.darkBgColor} rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <div className={action.iconColor}>
                    {action.icon}
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-xl">
                  {action.label}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
                  {action.description}
                </p>
                <div className={`inline-flex items-center gap-2 text-sm font-medium ${action.iconColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                  <span>Get Started</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Additional Quick Tips */}
        <motion.div
          className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
              <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                Pro Tips
              </h4>
              <p className="text-blue-800 dark:text-blue-200 text-sm">
                Use keyboard shortcuts (Ctrl+N for new task) and drag & drop to reorder tasks. 
                Mark tasks as done to track your progress and stay motivated!
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </ClientOnly>
  );
}
