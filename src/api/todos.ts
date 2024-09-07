import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 1369;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// Add more methods here
