import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 4579;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (data: Todo) => {
  return client.post(`/todos?userId=${USER_ID}`, data);
};

export const updateTodo = (todoId: number, data: Partial<Todo>) => {
  return client.patch(`/todos/${todoId}`, data);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

// Add more methods here
