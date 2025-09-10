import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3464;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const creatTodos = ({ title, completed, userId }: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, { title, completed, userId });
};

export const deleteTodos = (id: number) => {
  return client.delete(`/todos/${id}`);
};
