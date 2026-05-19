import { client } from '../utils/fetchClient';
import { Todo } from '../types/Todo';

export const USER_ID = 3657;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const postTodo = (todo: Omit<Todo, 'id'>): Promise<Todo> => {
  return client.post(`/todos`, todo);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
