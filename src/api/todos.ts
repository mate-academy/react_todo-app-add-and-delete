import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3990;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

type NewTodo = Omit<Todo, 'id'>;

export const addTodo = (todo: NewTodo) => {
  return client.post<Todo>('/todos', todo);
};

export const deleteTodo = (id: number) => {
  return client.delete<void>(`/todos/${id}`);
};
