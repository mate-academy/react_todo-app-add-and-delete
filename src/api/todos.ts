import { Todo, TodoPatchProps } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 1244;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (todo: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, todo);
};

export const updateTodo = (id: number, props: TodoPatchProps) => {
  return client.patch<Todo>(`/todos/${id}`, props);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export default {
  USER_ID,
  getTodos,
  addTodo,
  updateTodo,
  deleteTodo,
};
