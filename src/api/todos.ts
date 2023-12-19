import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

const postTodo = ({ userId, title, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', { userId, title, completed });
};

const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

const deleteComplitedTodos = (todosIds: number[]) => {
  const deletePromises = todosIds.map(todoId => {
    return client.delete(`/todos/${todoId}`);
  });

  return Promise.all(deletePromises);
};

export const apiClient = {
  getTodos,
  postTodo,
  deleteTodo,
  deleteComplitedTodos,
};
