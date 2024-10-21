import { USER_ID } from '../constants';
import { Todo } from '../types';
import { client } from '../utils';

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodo = (newTodo: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, newTodo);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${String(todoId)}`);
};
