import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3516;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// Add more methods here

export const createTodo = (title: string) => {
  return client.post<Todo>('/todos', {
    userId: USER_ID,
    title: title.trim(),
    completed: false,
  });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = (todoId: number, data: Partial<Todo>) => {
  return client.patch<Todo>(`/todos/${todoId}`, data);
};

export const clearCompletedTodos = (todos: Todo[]) => {
  const completed = todos.filter(todo => todo.completed);

  return Promise.allSettled(completed.map(todo => deleteTodo(todo.id)));
};
