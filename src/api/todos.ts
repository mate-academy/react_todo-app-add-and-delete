import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';
import { TodoModify } from '../types/TodoModify';

export const USER_ID = 3151;

export const TodoServiseErrors = {
  Unknown: 'Something when wrong with yodos',
  UnableToLoad: 'Unable to load todos',
  TitleShouldNotBeEmpty: 'Title should not be empty',
  UnableToAddTodo: 'Unable to add a todo',
  UnableToDeleteTodo: 'Unable to delete a todo',
  UnableToUpdateTodo: 'Unable to update a todo',
} as const;

export type TodoError =
  (typeof TodoServiseErrors)[keyof typeof TodoServiseErrors];
export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deleteTodo = (todoId: Todo['id']) => {
  return client.delete(`/todos/${todoId}`);
};

export const createTodo = (newTodo: TodoModify) => {
  return client.post<Todo>('/todos', newTodo);
};
// Add more methods here
