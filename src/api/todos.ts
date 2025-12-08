import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3525;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const createTodo = (title: string) => {
  const newTodo = {
    title,
    userId: USER_ID,
    completed: false,
  };

  return client.post<Todo>('/todos', newTodo);
};
