import { TodoCreate } from '../types/TodoCreate';
import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3648;

export enum TodoErrorMessage {
  UNABLE_TO_LOAD_TODOS = 'Unable_to_load_todos',
  TITLE_SHOULD_NOT_BE_EMPTY = 'Title_should_not_be_empty',
  UNABLE_TO_ADD_A_TODO = 'Unable_to_add_a_todo',
  UNABLE_TO_DELETE_A_TODO = 'Unable_to_delete_a_todo',
  UNABLE_TO_UPDATE_A_TODO = 'Unable_to_update_a_todo',
}
export const todoErrorMessageText: Record<TodoErrorMessage, string> = {
  [TodoErrorMessage.UNABLE_TO_LOAD_TODOS]: 'Unable to load todos',
  [TodoErrorMessage.TITLE_SHOULD_NOT_BE_EMPTY]: 'Title should not be empty',
  [TodoErrorMessage.UNABLE_TO_ADD_A_TODO]: 'Unable to add a todo',
  [TodoErrorMessage.UNABLE_TO_DELETE_A_TODO]: 'Unable to delete a todo',
  [TodoErrorMessage.UNABLE_TO_UPDATE_A_TODO]: 'Unable to update a todo',
};

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deleteTodos = (todoId: Todo['id']) => {
  return client.delete(`/todos/${todoId}`);
};

export const addTodo = (todoCreate: TodoCreate): Promise<Todo> => {
  return client.post('/todos', todoCreate);
};

export const todoServices = {
  getTodos,
  deleteTodos,
  addTodo,
};
