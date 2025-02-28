import { OmitTodo, Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 1597;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodos = ({ title, userId, completed }: OmitTodo) => {
  return client.post<Todo>('/todos', { title, userId, completed });
};

export const deleteTodos = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
