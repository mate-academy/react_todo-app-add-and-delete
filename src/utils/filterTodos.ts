import { FilterType } from '../Enums/FilterType';
import { Todo } from '../types/Todo';

export const filterTodos = (
  todos: Todo[], filterType: FilterType,
) => (
  todos.filter(todo => {
    switch (filterType) {
      case FilterType.ACTIVE:
        return todo.completed === false;
      case FilterType.COMPLETED:
        return todo.completed === true;
      default:
        return true;
    }
  })
);
