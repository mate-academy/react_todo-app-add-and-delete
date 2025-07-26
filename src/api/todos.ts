import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3224;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodo = (title: string) => {
  return client.post<Todo>('/todos', {
    userId: USER_ID,
    title,
    completed: false,
  });
};

export const deleteTodo = (id: number) => {
  return client.delete<void>(`/todos/${id}`);
};

export const clearCompletedTodos = (ids: number[]) => {
  return Promise.all(ids.map(id => deleteTodo(id)));
};
