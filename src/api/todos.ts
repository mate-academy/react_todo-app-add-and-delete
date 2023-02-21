import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const callGetTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const callAddTodo = (todo: Todo) => {
  return client.post<Todo>('/todos', todo);
};

export const callDeleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
