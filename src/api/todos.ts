import { Todo, TodoData } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = (todoData: TodoData) => {
  return client.post<Todo>('/todos', todoData);
};

export const removeTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
