import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3597;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const postTodo = (title: string) => {
  return client.post<Todo>('/todos', {
    title: title,
    userId: USER_ID,
    completed: false,
  });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
// Add more methods here
