import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = async (userId: number) => {
  return await client.get<Todo[]>(`/todos?userId=${userId}`) || null;
};

export const createTodos = async (todo: Todo) => {
  const { userId, title, completed } = todo;

  return client.post<Todo[]>('/todos', {
    userId,
    title,
    completed,
  });
};

export const removeTodo = async (todo: Todo) => {
  return client.delete(`/todos/${todo.id}`);
}

export const updateTodo = async (todo: Todo, completed: boolean) => {
  return client.patch(`/todos/${todo.id}`, { completed });
}

export const editTodo = async (todo: Todo, title: string) => {
  return client.patch(`/todos/${todo.id}`, { title });
}
