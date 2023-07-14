import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userID: number) => {
  return client.get<Todo[]>(`/todos?userId=${userID}`);
};

export const postTodo = (userID: number, newTodo: Omit<Todo, 'id'>) => {
  const {
    userId,
    title,
    completed,
  } = newTodo;

  return client.post<Todo>(`/todos?userId=${userID}`, {
    userId,
    title,
    completed,
  });
};

export const deleteTodo = (todoId: number) => {
  return client.delete<number>(`/todos/${todoId}`);
};
