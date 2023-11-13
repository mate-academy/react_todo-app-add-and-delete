import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = (todo: Todo) => {
  return client.post<Todo>('/todos', {
    userId: todo.userId,
    title: todo.title,
    completed: todo.completed,
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
// Add more methods here
