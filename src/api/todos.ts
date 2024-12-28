import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2135;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodos = (newTodo: Omit<Todo, 'id' | 'userId'>) => {
  return client.post<Todo>(`/todos`, { ...newTodo, userId: USER_ID });
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
