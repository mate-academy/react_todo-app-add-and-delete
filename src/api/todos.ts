import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 4347;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodo = (queryTitle: string) => {
  return client.post<Todo>(`/todos`, {
    title: queryTitle,
    userId: USER_ID,
    completed: false,
  });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
