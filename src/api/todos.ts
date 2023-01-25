import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = (fieldsToCreate: Omit<Todo, 'id'>) => {
  const body = JSON.stringify(fieldsToCreate);

  return client.post<Todo>('/todos', body);
};

export const deleteTodoById = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
