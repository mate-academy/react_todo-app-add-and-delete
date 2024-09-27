import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 251;
const URL = `/todos?userId=${USER_ID}`;

export const getTodos = () => {
  return client.get<Todo[]>(URL);
};

export const postTodos = (todo: Omit<Todo, 'id'>) => {
  return client.post<Todo>(URL, todo);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const patchTodos = (todoId: number, data: Todo) => {
  return client.patch(`/todos/${todoId}`, data);
};

export const replaceTodos = (data: Todo[]) => {
  return client.put(URL, data);
};
