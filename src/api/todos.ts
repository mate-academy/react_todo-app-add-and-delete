import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3126;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const postTodo = (todo: Todo) => {
  return client.post<Todo>(`/todos`, todo);
};

export const deleteTodo = (todo: Todo) => {
  return client.delete(`/todos/${todo.id}`);
};

export const updateTodo = (todo: Todo) => {
  return client.patch<Todo>(`/todos/${todo.id}`, {
    id: todo.id,
    userId: USER_ID,
    title: todo.title,
    completed: todo.completed,
  });
};
