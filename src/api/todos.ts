import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 424;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const postTodos = (data: { id: number; title: string }) => {
  return client.post(`/todos?userId=${USER_ID}`, data);
};

export const deleteTodos = (id: number) => {
  return client.delete(`/todos/` + id);
};

// Add more methods here
