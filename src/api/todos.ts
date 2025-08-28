import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';
import { USER_ID } from '../types/constants';

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodos = (data: Todo) => {
  return client.post<Todo>(`/todos`, data);
};

export const deleteTodos = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
