import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';
import { NewTodo } from '../types/NewTodo';

export const USER_ID = 4091;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodo = (data: NewTodo) => {
  return client.post('/todos', data);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
