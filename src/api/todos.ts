import { Todo } from '../types';
import { client } from '../utils/fetchClient';

export const USER_ID = 2341;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodo = (newTodo: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, newTodo);
};

export const deleteTodo = (id: Todo['id']) => {
  return client.delete(`/todos/${id}`);
};
