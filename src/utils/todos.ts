import { Todo } from '../types/Todo';
import { client } from './fetchClient';

export const createTodo = ({ title, completed, userId }: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', { title, completed, userId });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
