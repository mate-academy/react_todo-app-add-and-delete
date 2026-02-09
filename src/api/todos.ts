import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3929;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export type NewTodo = Omit<Todo, 'id'>;

export const postTodos = (newTodo: NewTodo) => {
  return client.post<Todo>(`/todos`, newTodo);
};

export const deleteTodos = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const patchTodos = (todo: Todo) => {
  return client.patch<Todo>(`/todos/${todo.id}`, todo);
};
