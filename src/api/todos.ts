import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 1249;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deleteTodos = (todoId: number) => {
  return client.delete(`/todo/${todoId}`);
};

export const addTodos = (todo: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todo/`, todo);
};
