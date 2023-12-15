import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 6158;

export const getTodos = (userId: number = USER_ID) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = (title: string) => {
  return client.post<Todo>('/todos', {
    title,
    completed: false,
    userId: USER_ID,
  });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export function updateTodo(
  // eslint-disable-next-line object-curly-newline
  { id, title, completed, userId }: Todo,
): Promise<Todo> {
  return client.patch(`/todos/${id}`, { title, completed, userId });
}
