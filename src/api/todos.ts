import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 1415;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodo = ({ title, userId, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos/', { title, userId, completed });
};

export const updateTodo = ({ id, userId, completed }: Omit<Todo, 'title'>) => {
  return client.patch<Todo>(`/todos/${id}`, { userId, completed });
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
