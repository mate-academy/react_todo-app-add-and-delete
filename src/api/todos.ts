import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

// Add more methods here
export const addTodo = (
  userId: number,
  { title, completed }: Omit<Todo, 'id'>,
) => {
  return client.post<Todo>('/todos', { title, completed, userId });
};

export const deleteTodo = (todoId:number) => client.delete(`/todos/${todoId}`);

export const editTodo = (
  todoId: number, status: { completed: boolean } | { title: string },
) => (
  client.patch(`/todos/${todoId}`, status)
);
