import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3802;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const postTodos = (todo: { title: string }) => {
  return client.post<Todo>('/todos', {
    title: todo.title,
    userId: USER_ID,
    completed: false,
  });
};

export const deleteTodo = (todoId: number) => {
  return client.delete<Todo>(`/todos/${todoId}`);
};

export const updateTodo = ({ id, completed }) => {
  return client.patch<Todo>(`/todos/${id}`, { completed });
};
