import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number | undefined) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = (title: string, userId: number | undefined) => {
  return client.post<Todo>('/todos', {
    userId,
    completed: false,
    title,
  });
};

export const updateTodo = (completed: boolean, userId: number | undefined) => {
  return client.patch<Todo>(`/todos?userId=${userId}`, {
    completed,
  });
};

export const deleteTodo = (todoId: number | undefined) => {
  return client.delete(`/todos/${todoId}`);
};
