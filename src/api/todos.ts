import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.
  get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = (title: string) => {
  return client.post<Todo>(`/todos`, {
    userId: 10,
    completed: false,
    title,
  });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`)
}
