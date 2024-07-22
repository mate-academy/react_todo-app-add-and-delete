import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 848;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deleteTodos = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const createTodos = ({ title, userId, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos/', { title, userId, completed });
};

export const updateTodos = ({ title, id, userId, completed }: Todo) => {
  return client.patch<Todo>(`/todos/'${id}`, { title, userId, completed });
};

// Add more methods here
