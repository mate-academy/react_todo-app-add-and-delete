import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = ({ title, completed, userId }: Omit<Todo, 'id'>) => {
  return client.post('/todos', { title, completed, userId });
};

export const updateTodo = (todoId: number, completed: boolean) => {
  return client.patch<Todo>(`/todos/${todoId}`, { completed });
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
