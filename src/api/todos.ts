import { Todoo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 534;

export const getTodos = () => {
  return client.get<Todoo[]>(`/todos?userId=${USER_ID}`);
};

export const postTodo = (newTodo: Todoo) => {
  return client.post<Todoo>('/todos', newTodo);
};
