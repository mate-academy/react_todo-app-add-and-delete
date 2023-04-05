import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (todo: Todo) => {
  return client.post<Todo>(`/todos?userId=${todo.userId}`, todo);
};

export const removeTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
