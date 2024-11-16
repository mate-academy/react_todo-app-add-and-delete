import { Todo, TodoTitleOrCompleted } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 1871;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const getFilteredTodos = (isCompleted: boolean) => {
  return client.get<Todo[]>(
    `/todos?userId=${USER_ID}&completed=${isCompleted}`,
  );
};

export const createTodos = (data: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', data);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const editTodo = (data: TodoTitleOrCompleted, todoId: number) => {
  return client.patch<Todo>(`/todos/${todoId}`, data);
};
