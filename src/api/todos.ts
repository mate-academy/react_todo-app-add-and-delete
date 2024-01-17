import { client } from '../_utils/fetchClient';
import { Todo } from '../types/Todo';
import { USER_ID } from '../types/USER_ID';

export const getTodosAPI = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodoAPI = (title: string) => client
  .post<Todo>('/todos',
  {
    title,
    userId: USER_ID,
    completed: false,
  });

export const deleteTodoAPI = (todoId: number) => client
  .delete(`/todos/${todoId}`);

export const toggleTodoAPI = (todoId: number, completed: boolean) => client
  .patch<Todo>(`/todos/${todoId}`,
  { completed: !completed });

export const updateTodoAPI = (todoId: number, title: string) => client
  .patch<Todo>(`/todos/${todoId}`,
  { title });
