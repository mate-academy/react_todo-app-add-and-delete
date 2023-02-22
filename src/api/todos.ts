import { NewTodo } from '../types/newTodo';
import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (todo: NewTodo, userId: number) => {
  return client.post<NewTodo>(`/todos?userId-${userId}`, todo);
};

export const deleteTodo = (userId: number) => {
  return client.delete(`/todos?userId=${userId}`);
};
