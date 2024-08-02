import { useMemo } from 'react';
import { FilterType } from '../types/FilterType';
import { Todo } from '../types/Todo';

type UseFilteredTodosProps = {
  todos: Todo[];
  filter: FilterType;
};

export const useFilteredTodos = ({
  todos,
  filter,
}: UseFilteredTodosProps): Todo[] => {
  return useMemo(() => {
    return todos.filter(todo => {
      if (filter === FilterType.Active) {
        return !todo.completed;
      }

      if (filter === FilterType.Completed) {
        return todo.completed;
      }

      return true;
    });
  }, [todos, filter]);
};
