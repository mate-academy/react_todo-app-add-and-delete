import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 4160;

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const postTodos = (todo: Todo) => {
  return client.post<Todo>(`/todos`, todo);
};

export const patchTodos = (todo: Todo) => {
  return client.patch<Todo>(`/todos`, todo);
};

export const deleteTodos = (todoId: number) => {
  return client.delete(`/todos?userId=${todoId}`);
};

// Add more methods here
