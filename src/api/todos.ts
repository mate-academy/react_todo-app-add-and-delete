import { Todo } from '../types/Todo';
import { TodoCreate } from '../types/TodoCreate';
import { client } from '../utils/fetchClient';

export const USER_ID = 3662;
// https://mate.academy/students-api/todos?userId=3662

export enum TodosServiceErrors {
  UNABLE_TO_LOAD_TODOS = 'unable_to_load_todos',
  TITLE_SHOULD_NOT_BE_EMPTY = 'title_should_not_be_empty',
  UNABLE_TO_ADD_A_TODO = 'unable_to_add_a_todo',
  UNABLE_TO_DELETE_A_TODO = 'unable_to_delete_a_todo',
  UNABLE_TO_UPDATE_A_TODO = 'unable_to_update_a_todo',
}

export const todosServiceErrorText: Record<TodosServiceErrors, string> = {
  [TodosServiceErrors.UNABLE_TO_LOAD_TODOS]: 'Unable to load todos',
  [TodosServiceErrors.TITLE_SHOULD_NOT_BE_EMPTY]: 'Title should not be empty',
  [TodosServiceErrors.UNABLE_TO_ADD_A_TODO]: 'Unable to add a todo',
  [TodosServiceErrors.UNABLE_TO_DELETE_A_TODO]: 'Unable to delete a todo',
  [TodosServiceErrors.UNABLE_TO_UPDATE_A_TODO]: 'Unable to update a todo',
};

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deleTodo = (todoId: Todo['id']) => {
  return client.delete(`/todos/${todoId}`);
};

export const addTodo = (todoCreate: TodoCreate) => {
  return client.post<Todo>('/todos', todoCreate);
};

export const updateTodoStatus = (
  todoId: Todo['id'],
  statusUpdate: { completed: boolean },
) => {
  return client.patch<Todo>(`/todos/${todoId}`, statusUpdate);
};

export const todosService = {
  getTodos,
  deleTodo,
  addTodo,
  updateTodoStatus,
};
