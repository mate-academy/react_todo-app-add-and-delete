import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = (newTodo: Omit<Todo, 'id'>) => {
  return client.post('/todos', newTodo);
};

export const removeTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
