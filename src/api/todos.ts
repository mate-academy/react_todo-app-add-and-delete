import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 1318;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deleteTodos = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const createTodos = ({ title, userId, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos/`, { title, userId, completed });
};
