/* eslint-disable no-console */
import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (data: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos?userId=${data.userId}`, data);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

// Add more methods here
