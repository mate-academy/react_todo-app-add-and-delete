import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const getTodo = (todoId: number) => {
  return client.get<Todo>(`/todos/${todoId}`);
};

export const postTodo = (data: Todo) => {
  return client.post('/todos/', data);
};

export const patchTodo = (todoId: number, data: Todo) => {
  return client.patch(`/todos/${todoId}`, data);
};

export const removeTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

// Add more methods here
