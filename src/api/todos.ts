import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

const createTodo = (fieldsToCreate: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', fieldsToCreate);
};

export const todoApi = {
  getTodos,
  createTodo,
  deleteTodo,
};
