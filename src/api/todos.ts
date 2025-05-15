import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2590;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const postTodos = (data: Todo) => {
  return client.post<Todo>(`/todos`, data);
};

export const deleteTodos = (id: number) => {
  return client.delete(`/todos/${id}`);
};

// Add more methods here
