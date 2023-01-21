import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const postTodos = (data: Todo) => {
  return client.post<Todo[]>('/todos', data);
};

export const deleteTodos = (userId: number) => {
  return client.delete(`/todos/${userId}`);
};
