import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 6864;

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const addTodo = (todo: Todo): Promise<Todo> => {
  return client.post('/todos/', todo);
};
