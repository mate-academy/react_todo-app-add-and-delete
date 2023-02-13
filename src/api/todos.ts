import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

// Add more methods here
export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const changeTodo = (todoId: number, title: string) => {
  return client.patch<Todo>(`/todos/${todoId}`, title);
};

export const addTodo = (
  title: string,
  userId: number,
  completed = false,
) => {
  return client.post<Todo>('/todos', { title, userId, completed });
};
