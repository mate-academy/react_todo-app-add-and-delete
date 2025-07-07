import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient.js';

export const USER_ID = 3111;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};
