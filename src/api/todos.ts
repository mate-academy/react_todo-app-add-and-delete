import { TodoInterface } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 633;

export const getTodos = () => {
  return client.get<TodoInterface[]>(`/todos?userId=${USER_ID}`);
};

// Add more methods here
export const updateTodo = (
  todoId: number,
  data: { [key: string]: boolean | string },
) => client.patch<TodoInterface>(`/todos/${todoId}`, data);

export const deleteTodo = (todoId: number) => client.delete(`/todos/${todoId}`);

export const createTodo = (data: {
  [key: string]: string | number | boolean;
}) => client.post<TodoInterface>(`/todos`, data);
