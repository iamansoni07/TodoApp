import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  Task,
  CreateTaskData,
  UpdateTaskData,
  TaskFilters,
} from '../utils/api';

// Query keys for consistent caching
export const taskKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskKeys.all, 'list'] as const,
  list: (filters: TaskFilters) => [...taskKeys.lists(), filters] as const,
  details: () => [...taskKeys.all, 'detail'] as const,
  detail: (id: string) => [...taskKeys.details(), id] as const,
  stats: () => [...taskKeys.all, 'stats'] as const,
};

/**
 * Hook for fetching tasks with filtering and sorting
 */
export function useTasks(filters: TaskFilters = {}) {
  return useQuery({
    queryKey: taskKeys.list(filters),
    queryFn: async () => {
      const result = await getTasks(filters);
      return result;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
}

/**
 * Hook for creating a new task
 */
export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskData: CreateTaskData) => {
      try {
        const result = await createTask(taskData);
        return result;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: (newTask) => {
      // Invalidate and refetch tasks list
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      
      // Also invalidate any specific task queries
      queryClient.invalidateQueries({ queryKey: taskKeys.details() });
      
      // Add the new task to the cache
      queryClient.setQueryData(
        taskKeys.detail(newTask._id),
        { success: true, data: newTask }
      );
    },
    onError: (error) => {
      // Error handling is done in the component
    }
  });
}

/**
 * Hook for updating an existing task
 */
export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskData }) =>
      updateTask(id, data),
    onSuccess: (updatedTask, { id }) => {
      // Invalidate and refetch tasks list
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      
      // Update the specific task in cache
      queryClient.setQueryData(
        taskKeys.detail(id),
        { success: true, data: updatedTask }
      );
    },
    onError: (error) => {
      // Error handling is done in the component
    },
  });
}

/**
 * Hook for deleting a task
 */
export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTask,
    onSuccess: (_, deletedId) => {
      // Invalidate and refetch tasks list
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      
      // Remove the deleted task from cache
      queryClient.removeQueries({ queryKey: taskKeys.detail(deletedId) });
    },
    onError: (error) => {
      // Error handling is done in the component
    },
  });
}

/**
 * Hook for toggling task status
 */
export function useToggleTaskStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: string) => {
      // First get the current task to toggle its status
      const currentTasks = await getTasks();
      const currentTask = currentTasks.find(task => task._id === taskId);
      
      if (!currentTask) {
        throw new Error('Task not found');
      }
      
      const nextStatusMap: Record<'todo' | 'in-progress' | 'done', 'todo' | 'in-progress' | 'done'> = {
        'todo': 'in-progress',
        'in-progress': 'done',
        'done': 'todo',
      };
      const newStatus = nextStatusMap[currentTask.status as 'todo' | 'in-progress' | 'done'] || 'todo';
      return updateTask(taskId, { status: newStatus });
    },
    onSuccess: (updatedTask, taskId) => {
      // Invalidate and refetch tasks list
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      
      // Update the specific task in cache
      queryClient.setQueryData(
        taskKeys.detail(taskId),
        { success: true, data: updatedTask }
      );
    },
    onError: (error) => {
      // Error handling is done in the component
    },
  });
}

