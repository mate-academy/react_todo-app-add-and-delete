import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 4473;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deleteTodos = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const addTodos = (data: object) => {
  return client.post<Todo>(`/todos`, data);
};

export const updateTodo = (id: number, todo: object) => {
  return client.patch<Todo>(`/todos/${id}`, todo);
};

// Add more methods here
