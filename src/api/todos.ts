import { client } from '../utils/fetchClient';
import { Todo } from './../types/Todo';

export const USER_ID = 628;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodo = (
  title: string,
  userId: number,
  completed = false,
): Promise<Todo> => {
  const data = { title, userId, completed };

  return client.post<Todo>('/todos', data);
};
