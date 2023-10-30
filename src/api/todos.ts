import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = ({ title, completed, userId }: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', { title, completed, userId });
};

export const updateTodo
  = (data: Partial<Todo>, todoId: Todo['id'], userId: Todo['userId']) => {
    return client.patch<Todo>(`/todos/${todoId}`, { ...data, userId });
  };

export const deleteTodo = (todoId: Todo['id']) => {
  return client.delete(`/todos/${todoId}`);
};

// Add more methods here
