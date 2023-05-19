import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number): Promise<Todo[]> => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (data: Todo): Promise<Todo> => {
  return client.post<Todo>('/todos', data);
};

export const deleteTodo = (id: number): Promise<Todo> => {
  return client.delete(`/todos/${id}`);
};
