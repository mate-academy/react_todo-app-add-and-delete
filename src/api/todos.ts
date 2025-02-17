import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 501;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = ({ title, userId, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos?userId=${USER_ID}`, {
    title,
    userId,
    completed,
  });
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const updateTodo = ({ id, ...data }: Todo) => {
  return client.patch<Todo>(`/todos/${id}`, data);
};
