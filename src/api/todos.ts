import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 4356;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodos = (data: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, data);
};

export const deleteTodos = (postId: number) => {
  return client.delete(`/todos/${postId}`);
};

export const changeTodos = (data: Omit<Todo, 'id'>) => {
  return client.patch<Todo>(`/todos/${USER_ID}`, data);
};
