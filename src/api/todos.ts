import { Todo } from '../types';
import { client } from '../utils';

export const USER_ID = 11530;

export const getTodos = (userId: number = USER_ID) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = (title: string, userId: number = USER_ID) => {
  return client.post<Todo>('/todos', {
    userId,
    title,
    completed: false,
  });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
