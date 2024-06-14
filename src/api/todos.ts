import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 770;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const postTodo = (todo: {
  title: string;
  userId: number;
  completed: boolean;
}) => {
  return client.post<Todo>(`/todos`, todo);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
