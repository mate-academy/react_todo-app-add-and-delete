import { client } from '../utils/fetchClient';
import { Todo } from '../types/typedefs';
export const USER_ID = 3090;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const postTodo = (todoData: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', todoData);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

// тут питання по Partial+Omit разом, чи ок таке писати -_-
export const updateTodo = (id: number, updates: Partial<Omit<Todo, 'id'>>) => {
  return client.patch<Todo>(`/todos/${id}`, updates);
};
