import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 751;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addPost = (data: Todo) => {
  return client.post<Todo>(`/todose`, data);
};

export const deletePost = (id: number) => {
  return client.delete(`/todos/${id}`);
};

// Add more methods here
