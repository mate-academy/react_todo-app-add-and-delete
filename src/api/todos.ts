import { Todo } from '../types/Todo';
import { NewTodo } from '../types/NewTodo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = ({ userId, title, completed }: NewTodo) => {
  return client.post<Todo>('/todos', {
    userId, title, completed,
  });
};

export const deleteTodos = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
