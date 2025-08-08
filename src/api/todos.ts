import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3298;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodos = (data: { title: string }) => {
  return client.post<Todo>(`/todos`, {
    ...data,
    userId: USER_ID,
    completed: false,
  });
};

export const deleteTodos = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
