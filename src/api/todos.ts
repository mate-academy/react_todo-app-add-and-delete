import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2602;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (data: Omit<Todo, 'id'>): Promise<Todo> => {
  return client.post<Todo>(`/todos?userId=${USER_ID}`, data);
};

export const deleteTodo = (postId: number) => {
  return client.delete(`/todos/${postId}`);
};
