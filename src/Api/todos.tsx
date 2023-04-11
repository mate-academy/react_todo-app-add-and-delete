import { NewTodo, Todo } from '../types/Todo';
import { client } from '../utils/fetchclient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const postTodo = (todo: NewTodo) => {
  return client.post<Todo>('/todos', todo);
};
