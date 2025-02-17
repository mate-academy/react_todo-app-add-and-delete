import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 678;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const creatTodo = (todo: Omit<Todo, 'id'>) =>
  client.post<Todo>('/todos', todo);

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const udateTodo = ({ id, userId, title, completed }: Todo) => {
  return client.patch<Todo[]>(`/todos/${id}`, { title, userId, completed });
};
