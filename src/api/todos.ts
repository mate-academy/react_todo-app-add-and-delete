import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = async (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const patchTodos = (userId: number, data: Todo[]) => {
  return client.patch<Todo[]>(`/todos?userId=${userId}`, data);
};

export const postTodos = (userId: number, data: Todo) => {
  return client.post<Todo[]>(`/todos?userId=${userId}`, data);
};

// Add more methods here
