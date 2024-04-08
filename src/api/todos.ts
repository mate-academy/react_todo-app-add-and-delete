import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 447;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodos = ({ title, userId, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, { title, userId, completed });
};

export const deleteTodos = (userId: number) => {
  return client.delete(`/todos/${userId}`);
};
