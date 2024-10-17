import { Todo } from '../types';
import { client } from '../utils';

export const USER_ID = 1589;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (newTodo: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, newTodo);
};

export const deleteTodo = (todoId: Todo['id']) => {
  return client.delete(`/todos/${todoId}`);
};
