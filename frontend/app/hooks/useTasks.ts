import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getTasks, 
  createTask, 
  updateTask, 
  deleteTask, 
  Task, 
  CreateTaskData, 
  UpdateTaskData, 
  TaskFilters 
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
 * Hook for fetching a single task by ID
 */
export function useTask(id: string) {
  return useQuery({
    queryKey: taskKeys.detail(id),
    queryFn: () => getTasks({ id }),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
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
      
      const newStatus = currentTask.status === 'pending' ? 'done' : 'pending';
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

/**
 * Hook for bulk operations on tasks
 */
export function useBulkTaskOperations() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ operation, taskIds, data }: {
      operation: 'delete' | 'update' | 'toggle';
      taskIds: string[];
      data?: any;
    }) => {
      const results = [];
      const errors = [];

      for (const taskId of taskIds) {
        try {
          let result;
          
          switch (operation) {
            case 'delete':
              result = await deleteTask(taskId);
              break;
            case 'update':
              result = await updateTask(taskId, data);
              break;
            case 'toggle':
              result = await updateTask(taskId, { 
                status: data?.status || 'done' 
              });
              break;
            default:
              throw new Error(`Unknown operation: ${operation}`);
          }
          
          results.push({ taskId, success: true, data: result });
        } catch (error: any) {
          errors.push({ 
            taskId, 
            success: false, 
            error: error.message 
          });
        }
      }

      return { results, errors, summary: {
        total: taskIds.length,
        successful: results.length,
        failed: errors.length
      }};
    },
    onSuccess: (result) => {
      // Invalidate and refetch tasks list
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      
      // Remove deleted tasks from cache
      if (result.summary.successful > 0) {
        result.results.forEach(({ taskId }) => {
          queryClient.removeQueries({ queryKey: taskKeys.detail(taskId) });
        });
      }
    },
    onError: (error) => {
      // Error handling is done in the component
    },
  });
}

/**
 * Hook for optimistic updates
 */
export function useOptimisticTaskUpdate() {
  const queryClient = useQueryClient();

  const updateTaskOptimistically = (
    taskId: string, 
    updates: Partial<Task>
  ) => {
    // Update the task in cache immediately
    queryClient.setQueryData(
      taskKeys.detail(taskId),
      (old: any) => ({
        ...old,
        data: { ...old?.data, ...updates }
      })
    );

    // Update the task in lists cache
    queryClient.setQueriesData(
      { queryKey: taskKeys.lists() },
      (old: any) => {
        if (!old?.data) return old;
        
        return {
          ...old,
          data: old.data.map((task: Task) =>
            task._id === taskId ? { ...task, ...updates } : task
          )
        };
      }
    );
  };

  return { updateTaskOptimistically };
}
