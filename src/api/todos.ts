import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 4196;
export const USER_URL = `/todos?userId=${USER_ID}`;

export const getTodos = () => {
  return client.get<Todo[]>(USER_URL);
};

// Add more methods here
