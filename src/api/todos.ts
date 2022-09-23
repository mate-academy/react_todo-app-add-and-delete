import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = (userId: number, title: string) => {
  return client.post<Todo>('/todos', {
    userId,
    title,
    completed: false,
  });
};

export const removeTodo = (todoID: number) => {
  return client.delete(`/todos/${todoID}`);
};
