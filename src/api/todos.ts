import { PostTodo, Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 405;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodo = (data: PostTodo) => {
  return client.post<Todo>(`/todos`, data);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
