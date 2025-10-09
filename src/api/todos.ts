import { InitialTodo, Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3443;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodo = (initialTodo: InitialTodo) => {
  return client.post<Todo>('/todos', initialTodo);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
