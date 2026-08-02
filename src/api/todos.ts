import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 1;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodos = (data: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, data);
};

export const deleteTodos = (dataId: number) => {
  return client.delete(`/todos/${dataId}`);
};

export const updateTodos = (data: Todo) => {
  return client.patch<Todo>(`/todos/${data.id}`, data);
};

// Add more methods here
