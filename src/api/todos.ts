import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 700;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const patchTodos = (todo: { id: number }) => {
  return client.patch<Todo>(`/todos/${todo.id}`, todo);
};

export const postTodos = (newTodo: object) => {
  return client.post<Todo>(`/todos/`, newTodo);
};

export const deleteTodos = (id: number) => {
  return client.delete<Todo[]>(`/todos/${id}`);
};

// Add more methods here
