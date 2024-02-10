import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export type CreateTodoField = Pick<Todo, 'title' | 'completed' | 'userId'>;

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const createTodo = (field: CreateTodoField) => {
  return client.post<Todo>('/todos', field);
};

export const updateTodo = (todo: Todo) => {
  return client.patch<Todo>(`/todos/${todo.id}`, {
    userId: todo.userId,
    title: todo.title,
    completed: todo.completed,
  });
};
