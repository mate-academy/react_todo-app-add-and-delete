import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 4070;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (userId: number, title: string) => {
  return client.post<Todo>('/todos', {
    userId,
    title,
    completed: false,
  });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
