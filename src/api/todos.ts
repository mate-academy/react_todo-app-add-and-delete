import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = async (todo: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', todo);
};

export const removeTodo = (todoId: number) => (
  client.delete(`/todos/${todoId}`)
);

export const editTodo = (id: number, todo: Partial<Todo>) => {
  return client.patch<Todo>(`/todos/${id}`, todo);
};
