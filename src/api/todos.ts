import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 468;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (title: string) => {
  const newTodo: Omit<Todo, 'id'> = {
    title: title,
    userId: USER_ID,
    completed: false,
  };

  return client.post<Todo>(`/todos`, newTodo);
};

export const updateTodo = ({ id, title, userId, completed }: Todo) => {
  return client.patch<Todo>(`/todos/${id}`, {
    title,
    userId,
    completed,
  });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
