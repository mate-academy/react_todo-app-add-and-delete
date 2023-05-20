import { Todo, NewTodo } from '../types/types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const postTodos = (userId: number, todo: NewTodo) => {
  return client.post<Todo>(`/todos?userId=${userId}`, todo);
};

export const deleteTodo = (userId: number, todoId: number) => {
  return client.delete(`/todos/${todoId}?userId=${userId}`);
};

export const patchTodo = (id: number, data: {}) => {
  return client.patch<Todo>(`/todos/${id}`, data);
};
