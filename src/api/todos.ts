import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const updateTodoStatus = (
  todoId: number,
  completed: boolean,
): Promise<Todo> => {
  const updatedTodo = { completed };

  return client.patch<Todo>(`/todos/${todoId}`, updatedTodo);
};

export const addTodo = (newTodo: Todo) => {
  return client.post<Todo>('/todos', newTodo);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

// Add more methods here
