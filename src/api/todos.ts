import { Todo } from '../types/Todo';
import { client } from '../utils/fetchingClient';

const todoEndPoint = '/todos/';
const todoUserEndPoint = '?userId=';
// const error = 'adafds/';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(
    todoEndPoint + todoUserEndPoint + userId,
  );
};

export const addTodo = (todo: Partial<Todo>) => {
  return client.post<Todo>(todoEndPoint, todo);
};

export const changeTodo = (todoId: number, todo: Todo) => {
  return client.patch<Todo>(todoEndPoint + todoId, todo);
};

export const removeTodo = (todoId: number) => {
  return client.delete<Todo>(todoEndPoint + todoId);
};
