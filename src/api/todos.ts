import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (userId: number, title: string) => {
  const newTodo = {
    userId,
    title,
    completed: false,
  };

  return client.post<Todo>('/todos', newTodo);
};

export const deleteTodoItem = (todoId: number) => {
  const url = `/todos/${todoId}`;

  return client.delete(url);
};
// Add more methods here
