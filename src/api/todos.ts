import { Todo } from '../types/Todo';
import { NewTodo } from '../types/NewTodo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (userId: number, data: NewTodo) => {
  return client.post<Todo>(`/todos?userId=${userId}`, data);
};

export const patchTodos = (todoId: number, data: NewTodo) => {
  return client.post<Todo[]>(`/todos/${todoId}`, data);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
