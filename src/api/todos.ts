import { ITodo } from '../types/ITodo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<ITodo[]>(`/todos?userId=${userId}`);
};

export const postTodo = (data: ITodo) => {
  return client.post<ITodo>('/todos', data);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = (todoId: number, data: Partial<ITodo>) => {
  return client.patch<Partial<ITodo>>(`/todos/${todoId}`, data);
};
