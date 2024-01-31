import { NewTodo } from '../types/NewTodo';
import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodos = (post: NewTodo) => {
  return client.post<Todo>('/todos', post);
};

export const deleteTodos = (id: number) => {
  return client.delete(`/todos/${id}`);
};
