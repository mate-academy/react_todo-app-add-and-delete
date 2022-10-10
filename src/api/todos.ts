import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number | undefined) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodos = (userId: number | undefined, title: string) => {
  return client.post<Todo>('/todos/', {
    userId,
    completed: false,
    title,
  });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = (todoID: number, data: Partial<Todo> | boolean) => {
  return client.patch<Todo>(`/todos/${todoID}`, data);
};

// Add more methods here
