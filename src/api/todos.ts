import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 1369;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const postTodo = (newTodo: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', newTodo);
};

export const changeTodo = (todo: Todo, todoId: number) => {
  return client.patch<Todo>(`/todos/${todoId}`, todo);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
