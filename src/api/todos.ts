import { Todo } from '../types/Todo';
import { TodoAgregate } from '../types/TodoAgregate';
import { client } from '../utils/fetchClient';

export const USER_ID = 3052;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (newTodo: TodoAgregate) => {
  return client.post<Todo>(`/todos?userId=${USER_ID}`, newTodo);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
