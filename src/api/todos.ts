import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const postTodos = ({ userId, completed, title }: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', { userId, completed, title });
};

export const deleteTodos = (id: number) => {
  return client.delete(`/todos/${id}`);
};
