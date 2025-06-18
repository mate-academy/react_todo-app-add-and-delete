import { Todo } from '../types/Todo';
import { TodoModify } from '../types/TodoModify';
import { client } from '../utils/fetchClient';

export const USER_ID = 3095;

export const TodoServiceErrors = {
  Unknown: 'Something when wrong with todos',
  UnableToLoad: 'Unable to load todos',
  TitleShouldNotBeEmpty: 'Title should not be empty',
  UnableToAdd: 'Unable to add a todo',
  UnableToDelete: 'Unable to delete a todo',
  UnableToUpdate: 'Unable to update a todo',
} as const;

export type TodoError =
  (typeof TodoServiceErrors)[keyof typeof TodoServiceErrors];

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deleteTodos = (todoId: Todo['id']) => {
  return client.delete(`/todos/${todoId}`);
};

export const createTodo = (newTodo: TodoModify) => {
  return client.post<Todo>('/todos', newTodo);
};
// Add more methods here
