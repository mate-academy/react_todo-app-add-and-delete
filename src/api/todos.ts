import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (userId: number, data: Omit<Todo, 'id'>) => {
  return client.post(`/todos?userId=${userId}`, data);
};

export const updateTodo = (userId: number, data: Todo) => {
  return client.patch(`/todos?userId=${userId}`, data);
};

export const deleteTodo = (userId: number) => {
  return client.delete(`/todos?userId=${userId}`);
};

// Add more methods here
