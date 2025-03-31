import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2512;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const delTodos = (todoId: number) => {
  return client.delete<number>(`/todos/${todoId}`);
};

export const createTodo = ({ userId, title, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, { userId, title, completed });
};
// Add more methods here
