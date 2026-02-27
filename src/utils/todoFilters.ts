import { Todo } from '../types/Todo';

export enum FilterType {
  ALL = 'All',
  ACTIVE = 'Active',
  COMPLETED = 'Completed',
}

export const filterTodos = (
  todos: Todo[],
  filter: FilterType,
  tempTodo: Todo | null = null,
): Todo[] => {
  const filtered = (() => {
    switch (filter) {
      case FilterType.ACTIVE:
        return todos.filter(todo => !todo.completed);
      case FilterType.COMPLETED:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  })();

  return tempTodo ? [...filtered, tempTodo] : filtered;
};
