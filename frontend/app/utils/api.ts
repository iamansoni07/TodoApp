import axios from 'axios';

// Make API URL configurable for different environments
const resolvedBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? (
  process.env.NODE_ENV === 'development' ? 'http://localhost:5000/api/tasks' : ''
);

if (!resolvedBaseUrl) {
  throw new Error('NEXT_PUBLIC_API_URL is not set in production.');
}

const API_BASE_URL = resolvedBaseUrl;

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  createdAt: string;
  updatedAt: string;
  dueDate?: string | null;
}

export interface CreateTaskData {
  title: string;
  description: string;
  status?: 'todo' | 'in-progress' | 'done';
  dueDate?: string | null; // ISO string
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: 'todo' | 'in-progress' | 'done';
  dueDate?: string | null; // ISO string
}

export interface TaskFilters {
  status?: 'todo' | 'in-progress' | 'done';
  sortBy?: 'title' | 'description' | 'status' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

// Helper function to handle API errors
type AxiosLikeError = {
  response?: { status: number; statusText: string; data?: { message?: string } };
  request?: unknown;
  message?: string;
};

const handleApiError = (error: AxiosLikeError): never => {
  if (error.response) {
    // Server responded with error status
    const message = error.response.data?.message || `HTTP ${error.response.status}: ${error.response.statusText}`;
    throw new Error(message);
  } else if (error.request) {
    // Request was made but no response received
    throw new Error('No response from server. Please check your connection.');
  } else {
    // Something else happened
    throw new Error(error.message || 'An unexpected error occurred.');
  }
};

// Create a new task
export const createTask = async (taskData: CreateTaskData): Promise<Task> => {
  try {
    const response = await axios.post(API_BASE_URL, taskData);
    
    // Handle backend response format: { success: boolean, data: Task }
    if (response.data.success && response.data.data) {
      return response.data.data;
    } else {
      throw new Error('Invalid response format from server');
    }
  } catch (error) {
    throw handleApiError(error as AxiosLikeError);
  }
};

// Get all tasks with optional filtering and sorting
export const getTasks = async (filters?: TaskFilters): Promise<Task[]> => {
  try {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);
    
    const response = await axios.get(`${API_BASE_URL}?${params.toString()}`);
    
    // Handle backend response format: { success: boolean, data: Task[] }
    if (response.data.success && Array.isArray(response.data.data)) {
      return response.data.data;
    } else {
      throw new Error('Invalid response format from server');
    }
  } catch (error) {
    throw handleApiError(error as AxiosLikeError);
  }
};

// Update a task
export const updateTask = async (id: string, taskData: UpdateTaskData): Promise<Task> => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${id}`, taskData);
    
    // Handle backend response format: { success: boolean, data: Task }
    if (response.data.success && response.data.data) {
      return response.data.data;
    } else {
      throw new Error('Invalid response format from server');
    }
  } catch (error) {
    throw handleApiError(error as AxiosLikeError);
  }
};

// Delete a task
export const deleteTask = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/${id}`);
  } catch (error) {
    throw handleApiError(error as AxiosLikeError);
  }
};
