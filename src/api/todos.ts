import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 4225;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const postTodo = (title: string) => {
  return client.post<Todo>('/todos', {
    userId: USER_ID,
    completed: false,
    title,
  });
};

export const updateTodo = (id: Todo['id'], data: Partial<Omit<Todo, 'id'>>) => {
  return client.patch<Todo>(`/todos/${id}`, data);
};

export const deleteTodo = (id: Todo['id']) => {
  return client.delete(`/todos/${id}`);
};
