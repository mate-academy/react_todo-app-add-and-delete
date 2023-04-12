import { Todo } from '../types/Todo';
import { client } from '../utils/fetchingClient';

const TODO_ENDPOINT = '/todos/';
const USER_ENDPOINT = '?userId=';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(
    TODO_ENDPOINT + USER_ENDPOINT + userId,
  );
};

export const addTodo = (todo: Partial<Todo>) => {
  return client.post<Todo>(TODO_ENDPOINT, todo);
};

export const changeTodo = (todoId: number, todo: Todo) => {
  return client.patch<Todo>(TODO_ENDPOINT + todoId, todo);
};

export const removeTodo = (todoId: number) => {
  return client.delete<Todo>(TODO_ENDPOINT + todoId);
};
