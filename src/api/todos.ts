import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';
import { USER_ID } from './Personal_Id';

export const getTodos = (): Promise<Todo[]> => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodos = (todo: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', todo);
};

export const deletePost = (id: number) => {
  return client.delete(`/todos/${id}`);
};
