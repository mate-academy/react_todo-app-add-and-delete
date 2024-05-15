import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 637;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deleteTodo = (todoId: string) => {
  return client.delete(`/todos/${todoId}`);
};

export const addTodo = ({ title, completed, userId }: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', { title, userId, completed });
};

export const updateTodo = ({ id, ...data }: Todo) => {
  return client.patch<Todo>(`/todos/${id}`, data);
};
