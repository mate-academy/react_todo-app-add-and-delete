import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3587;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodos = (title: string, userId = USER_ID) => {
  return client.post<Todo>(`/todos/`, { title, userId, completed: false });
};

export const deleteTodos = (todId: number) => {
  return client.delete(`/todos/${todId}`);
};

export const patchTodos = (
  todoId: number,
  { completed }: Pick<Todo, 'completed'>,
) => {
  return client.patch<Todo>(`/todos/${todoId}`, { completed });
};
