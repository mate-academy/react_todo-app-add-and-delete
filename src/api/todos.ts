import { NewTodo, Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 1469;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const postTodo = (todo: NewTodo) => {
  const todoWithUserId = { ...todo, userId: USER_ID };

  return client.post<Todo>(`/todos`, todoWithUserId);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const patchTodo = (id: number) => {
  return client.get<Todo[]>(`/todos/${id}`);
};
