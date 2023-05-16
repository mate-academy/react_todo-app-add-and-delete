import { Todo, TodoAdd } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const postTodo = (userId: number, dataAddTodo: TodoAdd) => {
  return client.post<TodoAdd>(`/todos?userId=${userId}`, dataAddTodo);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
