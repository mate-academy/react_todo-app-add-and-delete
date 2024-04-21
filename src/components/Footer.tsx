import cn from 'classnames';
import { FilterStatus } from '../utils/FilterStatus';
import { Todo } from '../types/Todo';
import { useCallback } from 'react';

type Props = {
  visibleTodos: Todo[];
  query: FilterStatus;
  filterQuery: (value: FilterStatus) => void;
  filteredCompletedTodos: Todo[];
  clearCompleted: (deleteTodos: Todo[]) => void;
};

export const Footer: React.FC<Props> = ({
  visibleTodos,
  query,
  filterQuery,
  filteredCompletedTodos,
  clearCompleted,
}) => {
  const isUncompleted = useCallback((todo: Todo) => {
    return !todo.completed;
  }, []);

  const todosAllUncomplited = visibleTodos.every(isUncompleted);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${filteredCompletedTodos.length} items left`}
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: query === FilterStatus.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => filterQuery(FilterStatus.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: query === FilterStatus.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => filterQuery(FilterStatus.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: query === FilterStatus.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => filterQuery(FilterStatus.Completed)}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={todosAllUncomplited}
        onClick={() => clearCompleted(visibleTodos)}
      >
        Clear completed
      </button>
    </footer>
  );
};
