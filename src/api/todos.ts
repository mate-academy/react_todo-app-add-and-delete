import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 1633;

export const getTodos = (): Promise<Todo[]> => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deleteTodo = (userId: number) => {
  return client.delete(`/todos/${userId}`);
};

export const addTodo = ({ title, userId, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, { title, userId, completed });
};

export const updateTodo = (userId: number, data: Todo) => {
  return client.patch<Todo>(`/todos/${userId}`, data);
};
