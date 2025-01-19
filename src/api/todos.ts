import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 1878;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodo = (todo: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', todo);
};

export const deleteTodo = (todoId: number): Promise<void> => {
  return client.delete(`/todos/${todoId}`) as Promise<void>;
};

export const updateTodo = (todoId: number, updates: Partial<Todo>) => {
  return client.patch<Todo>(`/todos/${todoId}`, updates);
};
