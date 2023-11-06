import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = (data: Todo) => {
  return client.post<Todo>('/todos', data);
};

export const deleteTodo = (itemId: number) => {
  return client.delete(`/todos/${itemId}`);
};

export const patchTodo = (itemId: number, completed: boolean) => {
  return client.patch(`/todos/${itemId}`, { completed });
};
