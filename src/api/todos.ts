import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const createTodo = (todoToCreate: Partial<Todo>) => {
  return client.post<Todo>('/todos/', todoToCreate);
};

export const updateTodos = ({ completed, title, id }: Omit<Todo, 'userId'>) => {
  return client.patch<Todo>(`/todos/${id}`, { completed, title });
};
