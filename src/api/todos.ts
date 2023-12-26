import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';
import { USER_ID } from '../lib/user';

const URL_PATH = `/todos?userId=${USER_ID}`;

export const getTodos = async () => {
  return client.get<Todo[]>(URL_PATH);
};

export const addTodo = async (todo: Omit<Todo, 'id'>) => {
  return client.post<Todo>(URL_PATH, todo);
};

export const deleteTodo = async (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const updateTodo = async (id: number, data: Partial<Todo>) => {
  return client.patch(`/todos/${id}`, data);
};
