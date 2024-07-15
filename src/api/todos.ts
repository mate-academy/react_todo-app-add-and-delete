import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 764;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// Add more methods here
export const postTodos = (data: Partial<Todo>) => {
  return client.post<Todo>('/todos', { ...data, userId: USER_ID });
};
