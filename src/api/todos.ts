import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3858;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const posttTodo = (title: string) => {
  return client.post<Todo>('/todos', {
    userId: USER_ID,
    title,
    completed: false,
  });
};

export const delTodos = (todoId: number): Promise<void> => {
  return client.delete(`/todos/${todoId}`);
};

export const patchTodo = (
  id: number,
  data: Partial<Pick<Todo, 'title' | 'completed'>>,
): Promise<Todo> => {
  return client.patch<Todo>(`/todos/${id}`, data);
};
