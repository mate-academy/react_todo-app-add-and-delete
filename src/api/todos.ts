import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodoToServer = ({
  userId, title, completed,
}: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', { userId, title, completed });
};

export const deleteTodoOnServer = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const deleteCompletedTodos = (todoArray: Todo[]) => {
  return Promise.all(todoArray.map(todo => deleteTodoOnServer(todo.id)));
};
