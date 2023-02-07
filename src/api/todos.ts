import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (todoToAdd: Todo) => {
  return client.post<Todo>('/todos', todoToAdd);
};

export const removeTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
