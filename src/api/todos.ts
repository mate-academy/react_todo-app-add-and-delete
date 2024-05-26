import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 640;

export const getTodos = () => client.get<Todo[]>(`/todos?userId=${USER_ID}`);

export const addTodo = (todo: Omit<Todo, 'id'>) =>
  client.post<Todo>('/todos', todo);

export const deleteTodo = (todoId: number) => client.delete(`/todos/${todoId}`);
