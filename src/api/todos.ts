import { Todo } from '../types/Types';
import { client } from '../utils/fetchClient';

export const USER_ID = 223;

export const getTodos = (userId = USER_ID) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const createTodos = ({ title, userId, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', { title, userId, completed });
};

export const updateTodo = ({ id, title, completed }: Omit<Todo, 'userId'>) => {
  return client.patch<Todo>(`/todos/${id}`, { title, completed });
};
