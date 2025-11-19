import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 0;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodo = (title: string) => {
  return client.post<Todo>('/todos', {
    title,
    completed: false,
    userId: USER_ID,
  });
};

export const updateTodo = (todoId: number, data: Partial<Omit<Todo, 'id'>>) => {
  return client.patch<Todo>(`/todos/${todoId}`, data);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const deleteCompletedTodos = (completedTodoIds: number[]) => {
  return Promise.all(
    completedTodoIds.map((id) => client.delete(`/todos/${id}`))
  );
}
