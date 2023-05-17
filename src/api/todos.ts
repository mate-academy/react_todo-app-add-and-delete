import { Todo } from '../types/Todo';
import { TempTodo } from '../types/typeDefs';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (todo: TempTodo) => {
  return client.post<Todo>('/todos', todo);
};

export const removeTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
