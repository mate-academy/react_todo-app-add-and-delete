import { TodoType } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 515;

export const clientGetTodos = () => {
  return client.get<TodoType[]>(`/todos?userId=${USER_ID}`);
};

export const clientPostTodo = (newTodo: Partial<TodoType>) => {
  return client.post<TodoType>(`/todos`, newTodo);
};

export const clientDeleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

// Add more methods here
