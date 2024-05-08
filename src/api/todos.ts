import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 560;

export const getTodosFromServer = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const postTodoToServer = (newTodo: Todo) => {
  return client.post<Todo>('/todos', newTodo);
};

export const deleteTodoFromServer = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
// Add more methods here
