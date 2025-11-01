import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3641;
const BASE_URL = '/todos';

export const getTodos = () => {
  return client.get<Todo[]>(BASE_URL + `?userId=${USER_ID}`);
};

export const addTodo = (data: Omit<Todo, 'id'>) => {
  return client.post<Todo>(BASE_URL, data);
};

export const updateTodo = (id: number, newData: Partial<Todo>) => {
  return client.patch(BASE_URL + `/${id}`, newData);
};

export const deleteTodo = (id: number) => {
  return client.delete(BASE_URL + `/${id}`);
};
