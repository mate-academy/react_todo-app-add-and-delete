import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3202;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (todo: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, {
    ...todo,
    userId: USER_ID,
  });
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}?userId=${USER_ID}`);
};

export const patchTodo = (id: number, completed: boolean) => {
  return client.patch<Todo>(`/todos/${id}?userId=${USER_ID}`, {
    completed,
  });
};
