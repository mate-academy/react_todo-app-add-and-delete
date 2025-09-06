import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3474;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (title: string, userId: number) => {
  return client.post<Todo>('/todos', {
    title,
    completed: false,
    userId,
  });
};

export const deleteTodo = (todo: Todo) => {
  return client.delete<Todo>(`/todos/${todo.id}`);
};
