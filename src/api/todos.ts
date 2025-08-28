import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3418;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const postTodos = ({ title, userId, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', { title, userId, completed });
};

export const deleteTodos = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const updateTodos = (id: number, dataToChange: Partial<Todo>) => {
  return client.patch<Todo>(`/todos/${id}`, dataToChange);
};
