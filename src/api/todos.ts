import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

// Add more methods here

export const addTodo = (userId: number, todo: Todo | null) => {
  return client.post<Todo>(`/todos?userId=${userId}`, todo);
};

export const removeTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
