import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3249;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (todo: Partial<Todo>): Promise<Todo> => {
  return client.post('/todos', todo);
};

// Add more methods here
