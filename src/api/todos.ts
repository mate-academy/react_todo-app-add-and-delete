import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';
import { ResponseAddTodo } from '../types/ResponseAddTodo';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (data: Omit<Todo, 'id'>): Promise<ResponseAddTodo> => {
  return client.post('/todos', data);
};

export const updateTodo = (userId: number, data: Todo) => {
  return client.patch(`/todos?userId=${userId}`, data);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
