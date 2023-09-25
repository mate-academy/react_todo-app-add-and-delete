import { Todo } from '../types';
import { client } from '../utils';

export const USER_ID = 11530;

export const getTodos = (userId: number = USER_ID) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

// Add more methods here
