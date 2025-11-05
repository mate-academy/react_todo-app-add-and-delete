import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';
import { TodoCreate } from '../types/TodoCreate';

export const USER_ID = 3658;

export enum TodosErrorsService {
  UNABLE_TO_LOAD_TODOS = 'unable_to_load_todos',
  TITLE_SHOULD_NOT_BE_EMPTY = 'Title_should_not_be_empty',
  UNABLE_TO_ADD_TODO = 'Unable_to_add_a_todo',
  UNABLE_TO_DELETE_TODO = 'Unable_to_delete_a_todo',
  UNABLE_TO_UPDATE_TODO = 'Unable_to_update_a_todo',
}

export const todosErrorsServiceText: Record<TodosErrorsService, string> = {
  [TodosErrorsService.UNABLE_TO_LOAD_TODOS]: 'Unable to load todos',
  [TodosErrorsService.TITLE_SHOULD_NOT_BE_EMPTY]: 'Title should not be empty',
  [TodosErrorsService.UNABLE_TO_ADD_TODO]: 'Unable to add a todo',
  [TodosErrorsService.UNABLE_TO_DELETE_TODO]: 'Unable to delete a todo',
  [TodosErrorsService.UNABLE_TO_UPDATE_TODO]: 'Unable to update a todo',
};

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deleteTodods = (todoId: Todo['id']) => {
  return client.delete(`/todos/${todoId}`);
};

export const addTodos = (todoCreate: TodoCreate) => {
  return client.post<Todo>('/todos', todoCreate);
};

export const todosService = {
  getTodos,
  deleteTodods,
  addTodos,
};
