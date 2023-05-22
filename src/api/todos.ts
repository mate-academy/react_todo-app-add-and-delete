import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (data: Omit<Todo, 'id'>) => {
  return client.post('/todos', data);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodoCompleted = (
  todoId: number,
  data: { completed: boolean },
) => client.patch(`/todos/${todoId}`, data);

export const updateTodoTitle = (
  todoId: number,
  data: { title: string },
) => client.patch(`/todos/${todoId}`, data);
