import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 4114;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodo = (payload: {
  title: string;
  userId: number;
  completed: boolean;
}) => {
  return client.post<Todo>('/todos', payload);
};

export const updateTodos = (payload: {
  id: number;
  title?: string;
  completed?: boolean;
}) => {
  const { id, ...data } = payload;

  return client.patch<Todo>(`/todos/${id}`, data);
};
// Add more methods here
