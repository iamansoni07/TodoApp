import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/tasks';

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'pending' | 'done';
  createdAt: string;
}

export interface CreateTaskData {
  title: string;
  description: string;
  status?: 'pending' | 'done';
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: 'pending' | 'done';
}

export interface TaskFilters {
  status?: 'pending' | 'done';
  sortBy?: 'title' | 'description' | 'status' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

// Helper function to handle API errors
const handleApiError = (error: any): never => {
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
    return response.data;
  } catch (error) {
    handleApiError(error);
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
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Update a task
export const updateTask = async (id: string, taskData: UpdateTaskData): Promise<Task> => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${id}`, taskData);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Delete a task
export const deleteTask = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/${id}`);
  } catch (error) {
    handleApiError(error);
  }
};
