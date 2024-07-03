import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 839;
//https://mate.academy/students-api/todos?userId=839

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// Add more methods here

export const createTodos = ({ userId, title, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, {
    userId,
    title,
    completed,
  });
};

export const updateTodos = ({ id, userId, title, completed }: Todo) => {
  return client.patch<Todo>(`/todos/${id}`, {
    id,
    userId,
    title,
    completed,
  });
};

export const deleteTodos = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
