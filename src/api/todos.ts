import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3603;

const TODOS_URL: string = `/todos`;

export const getTodos = () => {
  return client.get<Todo[]>(`${TODOS_URL}?userId=${USER_ID}`);
};

// Add more methods here
export const postTodo = (data: Omit<Todo, 'id'>): Promise<Todo> => {
  return client.post(TODOS_URL, data);
};

export const deleteTodos = (id: number) => {
  return client.delete(`${TODOS_URL}/${id}`);
};
