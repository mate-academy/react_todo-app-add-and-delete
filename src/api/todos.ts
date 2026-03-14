import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3941;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// Add more methods here

export const postTodo = (todo: Omit<Todo, 'id'>) =>
  client.post<Todo>(`/todos`, todo);

export const deleteTodo = (id: Todo['id']) => client.delete(`/todos/${id}`);
