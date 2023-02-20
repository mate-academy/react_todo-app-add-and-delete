import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (uri: string) => {
  return client.get<Todo[]>(`/todos${uri}`);
};
// eslint-disable-next-line
export const addTodos = (uri: string, data: any) => {
  return client.post<Todo>(`/todos${uri}`, data);
};

export const deleteTodos = (uri: string) => {
  return client.delete(`/todos${uri}`);
};

// Add more methods here
