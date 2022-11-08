import { SendedTodo } from '../types/SendedTodo';
import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const sendTodo = (userId: number, data: SendedTodo) => {
  return client.post<Todo>(`/todos?userId=${userId}`, data);
};

export const patchTodo = (
  todoId: number, title?: string, completed?: boolean,
) => {
  return client.patch<Todo>(`/todos/${todoId}`, { title, completed });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
