import { Item } from '../types/Todo';
import { client } from '../utils/fetchClient';

const USER_ID = 11860;

export const getTodos = () => {
  return client.get<Item[]>(`/todos?userId=${USER_ID}`);
};

export const createTodo = (todo: Omit<Item, 'id' | 'userId'>) => {
  return client.post<Item>('/todos', { ...todo, userId: USER_ID });
};

export const removeTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
