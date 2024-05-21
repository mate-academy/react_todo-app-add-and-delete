import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 667;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (data: Partial<Todo>) => client.post<Todo>('/todos', data);

export const deleteTodo = (todoId: number) => {
  return client.delete<Todo[]>(`/todos/${todoId}`);
};
