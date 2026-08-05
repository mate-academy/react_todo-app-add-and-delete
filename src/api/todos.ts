import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 1;

export const getTodos = () => client.get<Todo[]>(`/todos?userId=${USER_ID}`);

export const createTodo = (title: string) =>
  client.post<Todo>('/todos', {
    userId: USER_ID,
    title,
    completed: false,
  });

export const deleteTodo = (todoId: number) => client.delete(`/todos/${todoId}`);
