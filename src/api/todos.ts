import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 661;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodos = (data: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, data);
};

export const deleteTodos = (id: number) => {
  return client.delete(`/todos/${id}`);
};
