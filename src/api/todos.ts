import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 10140;

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

// Add more methods here

export const createTodo = (userId: number, title: string) => {
  return client.post<Todo>(`/todos?userId=${userId}`, {
    title: title.trim(),
    userId,
    completed: false,
  });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
