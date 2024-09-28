import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 1480;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// Add more methods here

export const addTodo = (data: {
  title: string;
  userId: number;
  completed: boolean;
}) => {
  return client.post<Todo>(`/todos`, data);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = (
  todoId: number,
  data: Partial<Todo>,
): Promise<Todo> => {
  return client.patch<Todo>(`/todos/${todoId}`, data);
};
