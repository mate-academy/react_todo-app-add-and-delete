import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 848;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deleteTodos = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

// Add more methods here
