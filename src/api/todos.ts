import { Todo } from '../types/Todo';
export type NewTodo = Omit<Todo, 'id'>;
import { client } from '../utils/fetchClient';

export const USER_ID = 2221;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const addTodo = (todo: NewTodo): Promise<Todo> => {
  return client.post(`/todos`, todo);
};
