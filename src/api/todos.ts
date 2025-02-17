import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';
///ilya@mail.com ilya
export const USER_ID = 693;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodo = (todo: Partial<Todo>) => {
  return client.post<Todo>(`/todos`, { userId: USER_ID, ...todo });
};

export const updateToDo = (id: number, updatedToDo: Partial<Todo>) => {
  return client.patch<Todo>(`/todos/${id}`, updatedToDo);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
