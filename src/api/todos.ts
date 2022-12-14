import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodos = (userId: number, title: string) => {
  return client.post<Todo>('/todos', {
    userId,
    completed: false,
    title,
  });
};

export const updateTodos = (todo: Todo) => {
  return client.patch(`/todos/${todo.id}`, todo);
};

export const deleteTodos = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
