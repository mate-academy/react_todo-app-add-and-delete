import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 4358;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodo = (title: string) => {
  return client.post<Todo>(`/todos`, {
    userId: USER_ID,
    title,
    completed: false,
  });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const patchTodo = (title: string) => {
  return client.patch<Todo>(`/todos`, {
    userId: USER_ID,
    title,
    completed: false,
  });
};

// Add more methods here
