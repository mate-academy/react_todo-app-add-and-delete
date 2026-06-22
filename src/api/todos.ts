import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 4329;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (todo: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, todo);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const patchTodo = (id: number, data: Partial<Omit<Todo, 'id'>>) => {
  return client.patch<Todo>(`/todos/${id}?userId=${USER_ID}`, data);
};

// Add more methods here
