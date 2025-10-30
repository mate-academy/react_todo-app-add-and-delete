import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3628;

export const enum TodosServiceErrors {
  UNABLE_TO_LOAD_TODOS = 'Unable_to_load_todos',
  TITLE_SHOULD_NOT_BE_EMPTY = 'title_should_not_be_empty',
  UNABLE_TO_ADD_TODO = 'Unable_to_add_a_todo',
  UNABLE_TO_DELETE_TODO = 'Unable_to_delete_a_todo',
  UNABLE_TO_UPDATE_TODO = 'Unable_to_updat_ a_todo',
}

export const todosServiceErrorText: Record<TodosServiceErrors, string> = {
  [TodosServiceErrors.UNABLE_TO_LOAD_TODOS]: 'Unable to load todos',
  [TodosServiceErrors.TITLE_SHOULD_NOT_BE_EMPTY]: 'Title should not be empty',
  [TodosServiceErrors.UNABLE_TO_ADD_TODO]: 'Unable to add a todo',
  [TodosServiceErrors.UNABLE_TO_DELETE_TODO]: 'Unable to delete a todo',
  [TodosServiceErrors.UNABLE_TO_UPDATE_TODO]: 'Unable to update a todo',
};

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodos = (title: string) => {
  return client.post<Todo>(`/todos`, {
    title: title.trim(),
    userId: USER_ID,
    completed: false,
  });
};

export const deleteTodos = (id: number) => {
  return client.delete(`/todos/${id}`);
};
