/* eslint-disable max-len */
/* eslint-disable object-curly-newline */
import { Todo } from '../types/Todo';
import { USER_ID } from '../utils/constants';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const deleteTodos = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const addTodos = ({ title }: { title: string }) => {
  return client.post<Todo>('/todos', { userId: USER_ID, title, completed: false });
};

export const updateTodos = ({ id, userId, title, completed }: Todo) => {
  return client.patch<Todo>(`/todos/${id}`, { userId, title, completed });
};
