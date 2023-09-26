/* eslint-disable */
import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};
export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
export const addTodo = (data: Todo) => {
  return client.post<Todo>(`/todos`, data);
};

// Add more methods here
