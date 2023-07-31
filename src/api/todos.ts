import { TodoType } from '../types/TodoType';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<TodoType[]>(`/todos?userId=${userId}`);
};

export const addTodo = (userId: number, todo: Omit<TodoType, 'id'>) => {
  return client.post<TodoType>(`/todos?userId=${userId}`, { ...todo });
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
