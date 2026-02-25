import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 1;

export const getTodos = () => client.get<Todo[]>(`/todos?userId=${USER_ID}`);

export const createTodo = (todo: Omit<Todo, 'id' | 'userId'>) =>
  client.post<Todo>('/todos', { ...todo, userId: USER_ID });

export const deleteTodo = (todoId: number) => client.delete(`/todos/${todoId}`);
