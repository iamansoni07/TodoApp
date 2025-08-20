'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    theme: 'system',
    notifications: true,
    autoSave: true,
    compactMode: false,
    language: 'en',
    timezone: 'UTC'
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const settingGroups = [
    {
      title: 'Appearance',
      icon: '🎨',
      settings: [
        {
          key: 'theme',
          label: 'Theme',
          description: 'Choose your preferred color scheme',
          type: 'select',
          options: [
            { value: 'light', label: 'Light' },
            { value: 'dark', label: 'Dark' },
            { value: 'system', label: 'System' }
          ]
        },
        {
          key: 'compactMode',
          label: 'Compact Mode',
          description: 'Reduce spacing for more content',
          type: 'toggle'
        }
      ]
    },
    {
      title: 'Notifications',
      icon: '🔔',
      settings: [
        {
          key: 'notifications',
          label: 'Enable Notifications',
          description: 'Receive alerts for task deadlines',
          type: 'toggle'
        }
      ]
    },
    {
      title: 'Data & Sync',
      icon: '💾',
      settings: [
        {
          key: 'autoSave',
          label: 'Auto Save',
          description: 'Automatically save changes',
          type: 'toggle'
        },
        {
          key: 'language',
          label: 'Language',
          description: 'Choose your preferred language',
          type: 'select',
          options: [
            { value: 'en', label: 'English' },
            { value: 'es', label: 'Español' },
            { value: 'fr', label: 'Français' },
            { value: 'de', label: 'Deutsch' }
          ]
        },
        {
          key: 'timezone',
          label: 'Timezone',
          description: 'Set your local timezone',
          type: 'select',
          options: [
            { value: 'UTC', label: 'UTC' },
            { value: 'EST', label: 'Eastern Time' },
            { value: 'PST', label: 'Pacific Time' },
            { value: 'GMT', label: 'Greenwich Mean Time' }
          ]
        }
      ]
    }
  ];

  const renderSettingControl = (setting: any) => {
    const value = settings[setting.key as keyof typeof settings];

    switch (setting.type) {
      case 'toggle':
        return (
          <motion.button
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              value ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
            }`}
            onClick={() => handleSettingChange(setting.key, !value)}
            whileTap={{ scale: 0.95 }}
          >
            <motion.span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                value ? 'translate-x-6' : 'translate-x-1'
              }`}
              layout
            />
          </motion.button>
        );

      case 'select':
        return (
          <select
            value={value as string}
            onChange={(e) => handleSettingChange(setting.key, e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            aria-label={setting.label}
          >
            {setting.options.map((option: any) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      default:
        return null;
    }
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
            Settings
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Customize your experience and configure app preferences
          </p>
        </motion.div>

        {/* Settings Groups */}
        <div className="space-y-8">
          {settingGroups.map((group, groupIndex) => (
            <motion.div
              key={group.title}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: groupIndex * 0.1 }}
            >
              {/* Group Header */}
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-xl">
                    {group.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {group.title}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Configure {group.title.toLowerCase()} preferences
                    </p>
                  </div>
                </div>
              </div>

              {/* Group Settings */}
              <div className="p-6 space-y-6">
                {group.settings.map((setting, settingIndex) => (
                  <motion.div
                    key={setting.key}
                    className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: groupIndex * 0.1 + settingIndex * 0.05 }}
                  >
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {setting.label}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {setting.description}
                      </p>
                    </div>
                    <div className="ml-6">
                      {renderSettingControl(setting)}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <motion.button
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Save Changes
          </motion.button>
          
          <motion.button
            className="px-8 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Reset to Defaults
          </motion.button>
        </motion.div>

        {/* Additional Options */}
        <motion.div
          className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-8 border border-amber-200 dark:border-amber-800"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-amber-100 dark:bg-amber-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h3 className="text-xl font-bold text-amber-900 dark:text-amber-100 mb-2">
              Advanced Options
            </h3>
            <p className="text-amber-800 dark:text-amber-200 mb-6">
              Manage your account, export data, or reset the application
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-colors duration-200">
                Export Data
              </button>
              <button className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200">
                Reset App
              </button>
              <button className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200">
                Account Settings
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
