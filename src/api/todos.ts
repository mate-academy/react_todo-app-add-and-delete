import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2513;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodos = ({ title, completed, userId }: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, { title, completed, userId });
};

export const deleteTodo = <T>(id: number): Promise<T> => {
  return client.delete(`/todos/${id}`) as Promise<T>;
};
