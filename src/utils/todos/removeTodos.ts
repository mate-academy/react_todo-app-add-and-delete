import { Todo } from '../../types/Todo';

export const revomesTodosById = (todos: Todo[], ids: number[]) =>
  todos.filter(({ id }) => !ids.includes(id));
