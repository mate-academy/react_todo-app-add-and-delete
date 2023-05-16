import { NewTodoData, Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = ((todo: NewTodoData) => {
  return client.post<Todo>('/todos', todo);
});

export const updateTodo = ((todoId: number, title: string) => {
  return client.patch(`/todos/${todoId}`, { title });
});

export const removeTodo = ((todoId: number) => {
  return client.delete(`/todos/${todoId}`);
});
