import { Todo } from '../types/Todo';
import { client } from '../utilities/fetchClient';

export const USER_ID = 1548;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deleteTodo = (postId: number) => {
  return client.delete(`/todos/${postId}`);
};

export const postTodo = (newTodo: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', newTodo);
};

export const editTodo = (todo: Todo, todoId: number) => {
  return client.patch<Todo>(`/todos/${todoId}`, todo);
};
