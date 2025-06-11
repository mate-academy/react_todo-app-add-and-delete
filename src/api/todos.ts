import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3025;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (newTodo: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, newTodo);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const changeTodo = (
  id: number,
  data: Record<string, boolean | number | string>,
) => {
  return client.patch<Todo>(`/todos/${id}`, data);
};

// Add more methods here
