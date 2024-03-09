import { USER_ID } from '../constants/userdata';
import { Todo } from '../types/Todo';
import { Update } from '../types/Update';
import { client } from '../utils/fetchClient';

export const createTodo = (newTodo: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', newTodo);
};

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const updateTodo = (todoId: number, data: Update) => {
  return client.patch<Todo>(`/todos/${todoId}`, data);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
