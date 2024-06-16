import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 800;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const addTodo = ({ title, userId, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, { title, userId, completed });
};

export const updateTodo = ({ id, title, userId, completed }: Todo) => {
  return client.patch<Todo>(`/todos/${id}`, { title, userId, completed });
};
