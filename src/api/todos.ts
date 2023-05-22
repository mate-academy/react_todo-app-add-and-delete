import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const removeTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = (todoId: number, title: string) => {
  return client.patch(`/todos/${todoId}`, { title });
};

export const addTodo = (todo: Todo): Promise<Todo> => {
  return client.post('/todos', todo);
};
