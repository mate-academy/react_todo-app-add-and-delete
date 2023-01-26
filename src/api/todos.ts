import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (newField: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', newField);
};

export const deleteTodo = (todoId: number) => (
  client.delete(`todos/${todoId}`)
);
