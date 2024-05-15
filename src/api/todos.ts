import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 620;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (todo: Todo) => {
  return client.post<Todo>('/todos', todo);
};
// Add more methods here

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
