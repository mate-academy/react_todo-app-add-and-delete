// eslint-disable-next-line import/extensions
import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3057;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodos = (data: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, data);
};

export const deleteTodos = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
