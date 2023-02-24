import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const removeTodo = (todoID: number) => {
  return client.delete(`/todos/${todoID}`);
};

export const updateTodo = (todoID: number, data: Partial<Todo>) => {
  return client.patch<Todo>(`/todos/${todoID}`, data);
};
