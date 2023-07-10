import { Todo } from '../types/Todo';
import { CreatedTodoArgs } from '../types/CreatedTodo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = (data: CreatedTodoArgs) => {
  return client.post<Todo>('/todos', data);
};

export const removeTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
