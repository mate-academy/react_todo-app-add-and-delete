import { Todos } from '../types/todo';
import { client } from '../utils/fetchClients';

export const getTodos = (userId: number) => {
  return client.get<Todos[]>(`/todos?userId=${userId}`);
};

export const postTodo = (userId: number, todo: Omit<Todos, 'id'>) => {
  return client.post<Todos>(`/todos?userId=${userId}`, todo);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
