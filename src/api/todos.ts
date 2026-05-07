import { Todo } from './types/Todo';
import { client } from './types/utils/fetchClient';

export const USER_ID = 1;

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getTodos = async () => {
  await wait(150);

  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = async (todo: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', todo);
};

export const deleteTodo = async (id: number) => {
  await wait(150);

  return client.delete(`/todos/${id}`);
};

export const updateTodo = async (id: number, data: Partial<Todo>) => {
  await wait(150);

  return client.patch<Todo>(`/todos/${id}`, data);
};
// Add more methods here
