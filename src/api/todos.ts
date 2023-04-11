import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';
import { NewTodo } from '../types/newTodo';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = (todo: NewTodo) => {
  return client.post<Todo[]>('/todos', todo);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
