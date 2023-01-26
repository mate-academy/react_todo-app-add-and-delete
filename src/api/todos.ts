import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = (
  newTodoBody: Pick<Todo, 'userId' | 'title' | 'completed'>,
) => {
  return client.post<Todo>('/todos', newTodoBody);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
