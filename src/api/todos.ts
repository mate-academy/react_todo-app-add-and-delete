import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 4494;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodo = ({
  title,
  userId,
}: {
  title: string;
  userId: number;
}) => {
  return client.post<Todo>(`/todos/`, { title, userId, completed: false });
};

export const deleteTodo = (todoId: number) => {
  return client.delete<number>(`/todos/${todoId}`);
};
