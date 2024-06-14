import { Todo } from '../../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 750;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (todo: Todo) => {
  return client.post<Todo>(`/todos`, todo);
};

export const createTodo = (todo: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, todo);
};

export const deleteTodo = (idNumber: number) => {
  return client.delete(`/todos/${idNumber}`);
};
