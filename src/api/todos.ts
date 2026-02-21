import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 12345;

type NewTodo = Omit<Todo, 'id'>;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (newTodo: NewTodo) => {
  return client.post<Todo>('/todos', newTodo);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
