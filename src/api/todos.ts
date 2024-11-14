import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 1806;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const postTodo = (newTodo: Omit<Todo, 'id'>): Promise<Todo> => {
  return client.post('/todos', newTodo);
};

export const deleteTodos = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
