import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { FilteredBy } from '../../helpers';

type Props = {
  onFilter: (filterType: FilteredBy) => void;
  todos: Todo[];
  filterBy: FilteredBy;
  onClear: () => void;
};

export const Footer: React.FC<Props> = ({
  onFilter,
  todos,
  filterBy,
  onClear,
}) => {
  const handleFilterChange = (filterType: FilteredBy) => {
    const updatedFilter: FilteredBy
      = filterBy === filterType ? FilteredBy.DefaultType : filterType;

    onFilter(updatedFilter);
  };

  const hasActiveTodos = todos.filter(todo => !todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${hasActiveTodos.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames(
            'filter__link', { selected: filterBy === FilteredBy.All },
          )}
          data-cy="FilterLinkAll"
          onClick={() => handleFilterChange(FilteredBy.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link', { selected: filterBy === FilteredBy.Active },
          )}
          data-cy="FilterLinkActive"
          onClick={() => handleFilterChange(FilteredBy.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link', { selected: filterBy === FilteredBy.Completed },
          )}
          data-cy="FilterLinkCompleted"
          onClick={() => handleFilterChange(FilteredBy.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={todos.every(todo => !todo.completed)}
        onClick={onClear}
      >
        Clear completed
      </button>
    </footer>
  );
};
