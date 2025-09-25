import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

// Substitua USER_ID pelo seu id (ex: 3514)
export const USER_ID = 3514;

export const getTodos = () => client.get<Todo[]>(`/todos?userId=${USER_ID}`);

export const addTodo = (title: string) =>
  client.post<Todo>('/todos', { title, userId: USER_ID, completed: false });

export const deleteTodo = (id: number) => client.delete(`/todos/${id}`);

export const updateTodo = (id: number, data: Partial<Todo>) =>
  client.patch<Todo>(`/todos/${id}`, data);
