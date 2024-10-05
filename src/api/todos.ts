import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 961;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodos = ({ title, completed, userId }: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', { title, completed, userId });
};

export const deleteTodos = (userId: number) => {
  return client.delete(`/todos/${userId}`);
};

export const updateTodos = ({ id, title, completed, userId }: Todo) => {
  return client.patch<Todo>(`/todos/${id}`, { title, completed, userId });
};
