import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 4535;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodo = (title: string) => {
  return client.post<Todo>('/todos', {
    title,
    completed: false,
    userId: USER_ID,
  });
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
