import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 653;

export const getTodos = () => {
  const path = `/todos?userId=${USER_ID}`;

  return client.get<Todo[]>(path);
};

export const addTodos = (data: any) => {
  const path = `/todos`;

  return client.post<Todo>(path, data);
};

export const deleteTodo = (id: number) => {
  const path = `/todos/${id.toString()}`;

  return client.delete(path);
};
