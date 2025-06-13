import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3046;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = ({
  userId,
  title,
  completed,
}: Omit<Todo, 'id'>): Promise<Todo> => {
  return client.post<Todo>(`/todos`, { userId, title, completed });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

// Add more methods here
