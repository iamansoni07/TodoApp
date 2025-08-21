  'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import Navigation from './Navigation';
import ClientOnly from './ClientOnly';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  // Background pattern now provided via CSS class in globals.css

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navigation */}
      <Navigation />
      
      {/* Hero Section */}
      <ClientOnly>
        <motion.section
          className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-black/10">
            <div className="absolute inset-0 opacity-20 bg-hero-pattern"></div>
          </div>

          <div className="relative z-10 container mx-auto px-4 py-24 sm:py-40">
            <motion.div
              className="text-center max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Professional Todo App
              </h1>
              <p className="text-xl sm:text-2xl mb-8 text-blue-100 leading-relaxed">
                Streamline your productivity with our intuitive task management solution. 
                Built with modern technologies and professional-grade architecture.
              </p>
              
              {/* Feature Highlights */}
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                  <div className="text-3xl mb-3">🚀</div>
                  <h3 className="font-semibold mb-2">Fast & Responsive</h3>
                  <p className="text-blue-100 text-sm">Built with Next.js and optimized for performance</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                  <div className="text-3xl mb-3">🔒</div>
                  <h3 className="font-semibold mb-2">Secure & Reliable</h3>
                  <p className="text-blue-100 text-sm">Enterprise-grade security and error handling</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                  <div className="text-3xl mb-3">📱</div>
                  <h3 className="font-semibold mb-2">Mobile First</h3>
                  <p className="text-blue-100 text-sm">Responsive design that works on all devices</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>
      </ClientOnly>

      {/* Main Content */}
      <main className="relative z-10">
        <div className="container mx-auto px-4 py-8">
          {children}
        </div>
      </main>
      <footer className="relative z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p>&copy; 2024 Professional Todo App. Built with modern web technologies.</p>
            <div className="flex justify-center items-center gap-4 mt-4 text-sm">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Next.js
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                React Query
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                Tailwind CSS
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
