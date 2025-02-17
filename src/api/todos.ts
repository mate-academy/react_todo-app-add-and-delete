import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 604;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const getTodoByID = (TODO_ID: number) => {
  return client.getByID(`/todos/${TODO_ID}`);
};

export const deleteTodo = (TODO_ID: number): Promise<number> => {
  return client.delete(`/todos/${TODO_ID}`) as Promise<number>;
};

export const createTodo = ({ userId, title, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, { userId, title, completed });
};

export const updateTodo = ({ id, userId, title, completed }: Todo) => {
  return client.patch<Todo>(`/todos/${id}`, { userId, title, completed });
};

// Add more methods here
