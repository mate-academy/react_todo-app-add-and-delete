import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = ({ title, completed, userId }: Todo) => {
  return client.post<Todo>('/todos', { title, completed, userId });
};

export const removeTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
// Add more methods here
