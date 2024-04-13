import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 349;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodo = (title: string) => {
  return client.post<Todo>(`/todos?userId=${USER_ID}`, {
    title,
    userId: USER_ID,
    completed: false,
  });
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
// Add more methods here
