import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3867;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodo = (data: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos?userId=${USER_ID}`, data);
};

export const updateTodo = (data: Partial<Todo>) => {
  return client.post<Todo>(`/todos?userId=${USER_ID}`, data);
};
