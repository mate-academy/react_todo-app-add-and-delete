import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 1594;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (newTodo: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, newTodo);
};

export const deleteTodo = (todoId: number) => {
  const url = `/todos/${todoId}`;

  return client.delete(url);
};

export const updateTodo = (todoId: number, updates: Partial<Todo>) => {
  const url = `/todos/${todoId}`;

  return client.patch<Todo>(url, updates);
};
