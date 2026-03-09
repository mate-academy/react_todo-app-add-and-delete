import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 4056;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// Add more methods here

export const addTodos = (newTodo: Todo) =>
  client.post<Todo>(`/todos/`, newTodo);

export const deleteTodos = (id: number) => {
  return client.delete(`/todos/${id}`);
};
