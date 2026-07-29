import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

// export const USER_ID = 0;
export const USER_ID = 4392;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// Add more methods here
