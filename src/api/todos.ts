import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 4144;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const sendTodo = ({
  userId,
  title,
  completed = false,
}: Omit<Todo, 'id'>) => {
  const todo = {
    userId: userId,
    title: title,
    completed: completed,
  };

  return client.post<Todo>(`/todos`, todo);
};

export const removeTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
