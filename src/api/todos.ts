import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 1298;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const postTodo = (todo: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', todo);
};

export const updateTodo = (todo: Todo) => {
  return client.patch<Todo[]>(`/todos/${todo.id}`, todo);
};

export const deleteSelectedTodo = (todo: Todo) => {
  return client.delete(`/todos/${todo.id}`);
};

// Add more methods here
