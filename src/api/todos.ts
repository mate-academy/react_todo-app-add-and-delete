import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  const url = `/todos?userId=${userId}`;

  return client.get<Todo[]>(url);
};

// Add more methods here

export const createTodo = (todo: Todo) => {
  const url = '/todos';

  return client.post<Todo>(url, todo);
};

export const changeTodoStatus = (todoId: number, completed: boolean) => {
  const url = `/todos/${todoId}`;

  return client.patch<Todo>(url, { completed });
};

export const deleteTodo = (todoId: number) => {
  const url = `/todos/${todoId}`;

  return client.delete(url);
};
