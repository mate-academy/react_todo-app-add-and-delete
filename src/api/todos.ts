import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = (todo: Todo | null) => {
  return client.post<Todo>('/todos', todo);
};

export const updateTodo = (todo: Todo) => {
  return client.patch<Todo>(`/todos/${todo.id}`, todo);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
