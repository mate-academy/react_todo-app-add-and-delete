/* eslint-disable no-console */
import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2564;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deleteTodos = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const addTodos = (newTodo: object): Promise<Todo> => {
  return client.post(`/todos`, { ...newTodo, userId: USER_ID });
};

// Add more methods here
