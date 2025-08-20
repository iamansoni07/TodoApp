'use client';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { useTasks } from '../hooks/useTasks';
import { Task } from '../utils/api';

export default function AnalyticsPage() {
  const { data: tasks = [], isLoading, error } = useTasks();

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-20">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="text-gray-600 dark:text-gray-400">Loading analytics...</span>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="text-center py-20">
          <div className="text-red-500 text-6xl mb-4">📊</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Error Loading Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {error.message || 'Failed to load task data for analytics'}
          </p>
        </div>
      </Layout>
    );
  }

  // Ensure tasks is an array and provide fallback
  const safeTasks = Array.isArray(tasks) ? tasks : [];

  // Calculate analytics
  const totalTasks = safeTasks.length;
  const completedTasks = safeTasks.filter(task => task.status === 'done').length;
  const pendingTasks = safeTasks.filter(task => task.status === 'pending').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Task creation trends (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();

  const tasksByDate = last7Days.map(date => {
    const dayTasks = safeTasks.filter(task => 
      task.createdAt?.startsWith(date)
    );
    return {
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      count: dayTasks.length,
      completed: dayTasks.filter(t => t.status === 'done').length
    };
  });

  // Task categories (based on title keywords)
  const categories = {
    'Work': safeTasks.filter(t => t.title.toLowerCase().includes('work') || t.title.toLowerCase().includes('project')).length,
    'Personal': safeTasks.filter(t => t.title.toLowerCase().includes('personal') || t.title.toLowerCase().includes('home')).length,
    'Study': safeTasks.filter(t => t.title.toLowerCase().includes('study') || t.title.toLowerCase().includes('learn')).length,
    'Health': safeTasks.filter(t => t.title.toLowerCase().includes('health') || t.title.toLowerCase().includes('exercise')).length,
    'Other': safeTasks.filter(t => !['work', 'personal', 'study', 'health'].some(cat => 
      t.title.toLowerCase().includes(cat)
    )).length
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Page Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Task Analytics
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Gain insights into your productivity patterns and task management habits
          </p>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Tasks</p>
                <p className="text-3xl font-bold">{totalTasks}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📋</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Completed</p>
                <p className="text-3xl font-bold">{completedTasks}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-6 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm font-medium">Pending</p>
                <p className="text-3xl font-bold">{pendingTasks}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">⏳</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Success Rate</p>
                <p className="text-3xl font-bold">{completionRate}%</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Task Creation Trend */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Task Creation Trend (Last 7 Days)
            </h3>
            <div className="space-y-4">
              {tasksByDate.map((day, index) => (
                <div key={day.date} className="flex items-center gap-4">
                  <div className="w-16 text-sm text-gray-600 dark:text-gray-400">
                    {day.date}
                  </div>
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-8 relative overflow-hidden">
                    <motion.div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(day.count / Math.max(...tasksByDate.map(d => d.count))) * 100}%` }}
                      transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                      {day.count} tasks
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Task Categories */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Task Categories
            </h3>
            <div className="space-y-4">
              {Object.entries(categories).map(([category, count], index) => {
                const percentage = totalTasks > 0 ? Math.round((count / totalTasks) * 100) : 0;
                const colors = {
                  'Work': 'from-blue-500 to-blue-600',
                  'Personal': 'from-green-500 to-green-600',
                  'Study': 'from-purple-500 to-purple-600',
                  'Health': 'from-red-500 to-red-600',
                  'Other': 'from-gray-500 to-gray-600'
                };
                
                return (
                  <div key={category} className="flex items-center gap-4">
                    <div className="w-20 text-sm font-medium text-gray-700 dark:text-gray-300">
                      {category}
                    </div>
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-6 relative overflow-hidden">
                      <motion.div
                        className={`bg-gradient-to-r ${colors[category as keyof typeof colors]} h-full rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, delay: 0.6 + index * 0.1 }}
                      />
                    </div>
                    <div className="w-12 text-right text-sm font-medium text-gray-700 dark:text-gray-300">
                      {count}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Productivity Insights */}
        <motion.div
          className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-8 border border-indigo-200 dark:border-indigo-800"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-2xl font-bold text-indigo-900 dark:text-indigo-100 mb-6">
            💡 Productivity Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-800 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-indigo-600 dark:text-indigo-400 text-lg">🎯</span>
                </div>
                <div>
                  <h4 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-1">
                    Focus Areas
                  </h4>
                  <p className="text-indigo-800 dark:text-indigo-200 text-sm">
                    {Object.entries(categories).sort(([,a], [,b]) => b - a)[0]?.[0] || 'General'} tasks dominate your workload. 
                    Consider balancing your focus across different areas.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-800 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-indigo-600 dark:text-indigo-400 text-lg">📈</span>
                </div>
                <div>
                  <h4 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-1">
                    Progress Tracking
                  </h4>
                  <p className="text-indigo-800 dark:text-indigo-200 text-sm">
                    You're completing {completionRate}% of your tasks. 
                    {completionRate >= 80 ? ' Excellent work!' : completionRate >= 60 ? ' Good progress!' : ' Keep pushing!'}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-800 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-indigo-600 dark:text-indigo-400 text-lg">⚡</span>
                </div>
                <div>
                  <h4 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-1">
                    Efficiency Tips
                  </h4>
                  <p className="text-indigo-800 dark:text-indigo-200 text-sm">
                    {pendingTasks > completedTasks ? 'Try breaking down larger tasks into smaller, manageable pieces.' : 'Great job maintaining momentum!'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-800 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-indigo-600 dark:text-indigo-400 text-lg">🎉</span>
                </div>
                <div>
                  <h4 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-1">
                    Achievement
                  </h4>
                  <p className="text-indigo-800 dark:text-indigo-200 text-sm">
                    {completedTasks > 0 ? `You've completed ${completedTasks} task${completedTasks !== 1 ? 's' : ''} so far!` : 'Start completing tasks to see your achievements here!'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
