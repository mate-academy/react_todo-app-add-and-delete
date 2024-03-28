import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 282;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (todo: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, todo);
};

export const editTodos = ({ id, userId, title, completed }: Todo) => {
  return client.patch<Todo>(`/todos/${id}?userId=${USER_ID}`, {
    id,
    userId,
    title,
    completed,
  });
};

export const deleteTodos = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
