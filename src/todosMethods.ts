import { Todo } from './types/Todo';
import { apiClient } from './utils/fetchClient';

export const deleteTodo = (todoId: number) => {
  return apiClient.delete(`/todos/${todoId}`);
};

export const getTodos = (userId: number) => {
  return apiClient.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = ({ title, completed, userId }: Omit<Todo, 'id'>) => {
  return apiClient.post<Todo>('/todos', { title, completed, userId });
};
