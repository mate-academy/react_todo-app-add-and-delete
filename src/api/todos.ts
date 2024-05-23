import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 694;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodo = (todo: Partial<Todo>) => {
  return client.post<Todo>(`/todos`, { userId: USER_ID, ...todo });
};

export const updateTodo = (id: number, updatedTodo: Partial<Todo>) => {
  return client.patch<Todo>(`/todos/${id}`, updatedTodo);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
