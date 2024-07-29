import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 1096;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deleteTodos = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const postTodos = ({ userId, title, completed }: Omit<Todo, 'id'>) => {
  return client.post(`/todos`, { userId, title, completed });
};
