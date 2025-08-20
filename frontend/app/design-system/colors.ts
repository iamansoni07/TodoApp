/**
 * Professional Design System - Color Palette
 * Consistent color scheme for the Todo application
 */

export const colors = {
  // Primary Colors
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6', // Main primary color
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554'
  },

  // Secondary Colors
  secondary: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b', // Main secondary color
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617'
  },

  // Success Colors
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e', // Main success color
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16'
  },

  // Warning Colors
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b', // Main warning color
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
    950: '#451a03'
  },

  // Error Colors
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444', // Main error color
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
    950: '#450a0a'
  },

  // Neutral Colors
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373', // Main neutral color
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0a0a0a'
  },

  // Dark Mode Colors
  dark: {
    bg: '#0f172a',
    surface: '#1e293b',
    surfaceHover: '#334155',
    border: '#334155',
    text: '#f8fafc',
    textSecondary: '#cbd5e1',
    accent: '#3b82f6'
  },

  // Light Mode Colors
  light: {
    bg: '#ffffff',
    surface: '#f8fafc',
    surfaceHover: '#f1f5f9',
    border: '#e2e8f0',
    text: '#0f172a',
    textSecondary: '#475569',
    accent: '#3b82f6'
  }
};

/**
 * Semantic color mapping for consistent usage
 */
export const semanticColors = {
  // Text colors
  text: {
    primary: colors.light.text,
    secondary: colors.light.textSecondary,
    inverse: colors.light.bg,
    disabled: colors.neutral[400]
  },

  // Background colors
  background: {
    primary: colors.light.bg,
    secondary: colors.light.surface,
    tertiary: colors.light.surfaceHover,
    overlay: 'rgba(0, 0, 0, 0.5)'
  },

  // Border colors
  border: {
    primary: colors.light.border,
    secondary: colors.neutral[300],
    focus: colors.primary[500],
    error: colors.error[500]
  },

  // Status colors
  status: {
    pending: colors.warning[500],
    completed: colors.success[500],
    error: colors.error[500],
    info: colors.primary[500]
  },

  // Interactive colors
  interactive: {
    primary: colors.primary[500],
    primaryHover: colors.primary[600],
    primaryActive: colors.primary[700],
    secondary: colors.secondary[500],
    secondaryHover: colors.secondary[600],
    secondaryActive: colors.secondary[700]
  }
};

/**
 * Dark mode semantic color mapping
 */
export const darkModeColors = {
  text: {
    primary: colors.dark.text,
    secondary: colors.dark.textSecondary,
    inverse: colors.dark.bg,
    disabled: colors.neutral[500]
  },

  background: {
    primary: colors.dark.bg,
    secondary: colors.dark.surface,
    tertiary: colors.dark.surfaceHover,
    overlay: 'rgba(0, 0, 0, 0.7)'
  },

  border: {
    primary: colors.dark.border,
    secondary: colors.neutral[600],
    focus: colors.primary[400],
    error: colors.error[400]
  },

  status: {
    pending: colors.warning[400],
    completed: colors.success[400],
    error: colors.error[400],
    info: colors.primary[400]
  },

  interactive: {
    primary: colors.primary[400],
    primaryHover: colors.primary[500],
    primaryActive: colors.primary[600],
    secondary: colors.secondary[400],
    secondaryHover: colors.secondary[500],
    secondaryActive: colors.secondary[600]
  }
};

export default colors;
