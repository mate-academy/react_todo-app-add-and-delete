import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2619;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deleteTodo = (todoId: string) => {
  return client.delete(`/todos/${todoId}`);
};

export const addTodo = (title: string) => {
  return client.post<Todo>(`/todos`, {
    title: title,
    userId: USER_ID,
    completed: false,
  });
};
