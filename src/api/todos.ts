import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`?userId=${userId}`);
};

export const removeTodo = (id: number) => {
  return client.delete(`/${id}`);
};

export const postTodo = ({ title, userId, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>('', { title, userId, completed });
};
