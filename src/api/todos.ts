import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2132;
export const TODOS_ENDPOINT = '/todos';

export const getTodos = () => {
  return client.get<Todo[]>(`${TODOS_ENDPOINT}?userId=${USER_ID}`);
};

export const addTodo = (data: Omit<Todo, 'id'>) => {
  return client.post<Todo>(TODOS_ENDPOINT, data);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`${TODOS_ENDPOINT}/${todoId}`);
};
