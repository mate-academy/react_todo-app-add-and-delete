import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 29;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const getAdd = (todo: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', todo);
};

export const getDelete = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

