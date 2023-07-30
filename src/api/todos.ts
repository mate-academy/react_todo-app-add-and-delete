import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addOnServer = (todo: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', todo);
};

export const deleteOnServer = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateOnServer = ({ completed, id, title }: Todo) => {
  return client.patch<Todo[]>(`/todos/${id}`, { completed, id, title });
};
