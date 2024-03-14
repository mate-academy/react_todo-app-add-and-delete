import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 1;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deleteTodos = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const addTodos = (todo: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', todo);
};
