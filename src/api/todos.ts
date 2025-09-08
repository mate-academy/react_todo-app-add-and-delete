import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3442;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const createTodo = (title: string) => {
  return client.post<Todo>('/todos', {
    userId: USER_ID,
    title,
    completed: false,
  });
};

export const updateTodo = (todoId: number, updatedFields: Partial<Todo>) => {
  return client.patch<Todo>(`/todos/${todoId}`, updatedFields);
};

export const clearCompletedTodos = (todos: Todo[]) => {
  const completedTodos = todos.filter(todo => todo.completed);

  return Promise.all(completedTodos.map(todo => deleteTodo(todo.id)));
};

export const toggleTodo = (todoId: number, completed: boolean) => {
  return client.patch<Todo>(`/todos/${todoId}`, { completed });
};

export const toggleAllTodos = (todos: Todo[], completed: boolean) => {
  const updatePromises = todos.map(todo =>
    client.patch<Todo>(`/todos/${todo.id}`, { completed }),
  );

  return Promise.all(updatePromises);
};
