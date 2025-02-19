import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2329;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// Add more methods here
// POST new TODO
export const addTodo = (data: Omit<Todo, 'id' | 'userId'>) => {
  return client.post<Todo>('/todos', { ...data, userId: USER_ID });
};

// Remove TODO
export const removeTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
