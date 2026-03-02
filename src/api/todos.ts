import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3995;

export const getTodos = async (): Promise<Todo[]> => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};
