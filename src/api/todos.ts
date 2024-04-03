import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 391;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deleteTodos = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const createTodos = ({ userId, completed, title }: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, { userId, completed, title });
};

export const upDateTodos = ({ id, userId, completed, title }: Todo) => {
  return client.patch<Todo>(`/todos/${id}`, { id, userId, completed, title });
};
