import { FilterOption } from '../enum/FilterOption';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[],
  filterSelected: FilterOption,
};

export const useTodosFilter = ({ todos, filterSelected }: Props): Todo[] => (
  todos.filter(todo => {
    switch (filterSelected) {
      case FilterOption.Active:
        return !todo.completed;

      case FilterOption.Completed:
        return todo.completed;

      default:
        return true;
    }
  })
);
