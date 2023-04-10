import { Todo } from '../types/Todo';
import { client } from '../utils/fetchingClient';

const todoEndPoint = '/todo/';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(todoEndPoint + userId);
};

export const addTodo = (todo: Todo) => {
  return client.post<Todo>(todoEndPoint, todo);
};

export const changeTodo = (todoId: number, todo: Todo) => {
  return client.patch<Todo>(todoEndPoint + todoId, todo);
};

export const deleteTodo = (todoId: number) => {
  return client.delete<Todo>(todoEndPoint + todoId);
};
