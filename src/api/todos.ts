import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2319;

export const getTodos = (): Promise<Todo[]> => {
  return client.get(`/todos?userId=${USER_ID}`);
};

export const createTodo = ({ title, userId, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, { title, userId, completed });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = (id: number, completed: boolean): Promise<Todo> => {
  return client.patch(`/todos/${id}`, { completed });
};

// Add more methods here
