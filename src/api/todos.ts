import { Todo } from '../types/Todo';
import { client } from '../utils.ts/fetch.Client';
import { NewTodo } from '../types/NewTodo';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (todo: NewTodo) => {
  return client.post<Todo>('/todos', todo);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
