import { client } from '../utils/fetchClient';
import { Todo } from '../types/Todo';

export const USER_ID = 2599;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (title: string) => {
  return client.post<Todo>('/todos', {
    userId: USER_ID,
    title,
    completed: false,
  });
};

export const updateTodo = (todo: Todo) => {
  return client.patch<Todo>(`/todos/${todo.id}`, todo);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
