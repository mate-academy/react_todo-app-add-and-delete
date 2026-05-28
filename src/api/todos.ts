import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 4234;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodo = (title: string) => {
  const data: Omit<Todo, 'id'> = {
    userId: Number(USER_ID),
    title,
    completed: false,
  };

  return client.post<Todo>(`/todos`, data);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
