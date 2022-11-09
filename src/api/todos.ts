import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const newTodo = (title: string, userId: number) => {
  const data = {
    title,
    userId,
    completed: false,
  };

  return client.post<Todo>('/todos', data);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${String(todoId)}`);
};
