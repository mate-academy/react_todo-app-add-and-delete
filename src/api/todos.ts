import { Todo } from '../types/Todo';
import { client } from '../httpClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const addTodo = (newTodo: Omit<Todo, 'id'>) => {
  return client.post('/todos', newTodo);
};
