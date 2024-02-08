import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const postTodo = (userId: number, title: string, id: number) => {
  const data: Todo = {
    id,
    userId,
    title,
    completed: false,
  };

  return client.post<Todo>(`/todos?userId=${userId}`, data);
};
