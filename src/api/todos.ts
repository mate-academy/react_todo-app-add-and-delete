import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2085;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// Add more methods here

export const deleteTodo = (TODO_ID: number) => {
  return client.delete(`/todos/${TODO_ID}`);
};

export const addTodo = (todo: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, todo);
};
