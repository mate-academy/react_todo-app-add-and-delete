import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3538;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodo = (title: string) => {
  return client.post<Todo>('/todos', {
    title,
    userId: USER_ID,
    completed: false,
  });
};

export const removeTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const toggleTodoStatus = (id: number, completed: boolean) => {
  return client.patch<Todo>(`/todos/${id}`, { completed });
};

export const toggleAllTodosStatus = (todos: Todo[], completed: boolean) => {
  return Promise.all(
    todos.map(todo => client.patch<Todo>(`/todos/${todo.id}`, { completed })),
  );
};
