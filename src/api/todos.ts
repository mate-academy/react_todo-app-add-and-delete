import { client } from '../utils/fetchClient';
import { Todo } from '../types/Todo';

export const USER_ID = 3591;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodo = (title: string) => {
  return client.post<Todo>('/todos', {
    title: title.trim(),
    userId: USER_ID,
    completed: false,
  });
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
