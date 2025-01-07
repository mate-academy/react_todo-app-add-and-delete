import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2202;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodos = ({ title, completed, userId }: Omit<Todo, 'id'>) => {
  return client.post<Todo[]>(`/todos`, { title, completed, userId });
};

export const patchTodos = (todo: Todo) => {
  return client.patch<Todo[]>(`/todos/${todo.id}`, todo);
};

export const deleteTodos = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
