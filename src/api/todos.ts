import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (
  title: string,
  userId: number,
  completed: boolean,
) => {
  return client.post<Todo[]>('/todos', {
    title,
    userId,
    completed,
  });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const clearTodos = (todoIds: number[]) => {
  return Promise.all(
    todoIds.map(todoId => client.delete(`/todos/${todoId}`)),
  );
};

export const switchTodoStatus = (
  todo: Todo,
) => {
  return client.patch<Todo[]>(`/todos/${todo.id}`, {
    completed: !todo.completed,
  });
};
