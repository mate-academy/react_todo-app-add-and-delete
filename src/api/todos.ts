import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

const USER_ID = 11828;

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = (title: string) => {
  return client.post<Todo>('/todos', {
    userId: USER_ID,
    title,
    completed: false,
  });
};

export const updateTodos = (todo: Todo) => {
  return client.patch<Todo[]>(`/todos/${todo.id}`, {
    userId: todo.userId,
    title: todo.title,
    completed: todo.completed,
  });
};

export const deleteTodos = (id: number) => {
  return client.delete(`/todos/${id}`);
};
