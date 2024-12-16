import { Todo as Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2077;
const url = `/todos`;

export const getTodos = () => {
  return client.get<Todo[]>(`${url}?userId=${USER_ID}`);
};

export const createTodo = (todo: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`${url}`, todo);
};

export const editTodo = (todo: Todo) => {
  return client.patch<Todo>(`${url}/${todo.id}`, todo);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`${url}/${todoId}`);
};
