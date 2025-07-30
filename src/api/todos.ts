/* eslint-disable @typescript-eslint/no-shadow */
import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3262;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = ({ title, completed }: Omit<Todo, 'id' | 'userId'>) => {
  return client.post<Todo>('/todos', { title, userId: USER_ID, completed });
};

export const updateTodo = (todoId: number, updatedTodo: Partial<Todo>) => {
  return client.patch<Todo>(`/todos/${todoId}`, updatedTodo);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
