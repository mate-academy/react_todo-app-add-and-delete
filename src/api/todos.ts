import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 371;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// Add more methods here

export const createTodos = (title: string) => {
  return client.post<Todo>(`/todos?userId=${USER_ID}`, {
    title,
    userId: USER_ID,
    completed: false,
  });
};

export const deleteTodos = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
