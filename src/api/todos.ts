import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = ({ title, completed, userId }: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', { title, completed, userId });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const patchTodoStatus = (todoId: number,
  { completed }: Pick<Todo, 'completed'>) => {
  return client.patch(`/todos/${todoId}`, { completed });
};

export const patchTodoTitle = (todoId: number,
  { title }: Pick<Todo, 'title'>) => {
  return client.patch(`/todos/${todoId}`, { title });
};
