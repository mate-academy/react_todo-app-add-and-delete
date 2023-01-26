import classNames from 'classnames';
import { Todo } from '../../types/Todo';

/* eslint-disable jsx-a11y/control-has-associated-label */
type Props = {
  filter: string,
  isCompleted: boolean,
  todos: Todo[],
  onCompletedClear: () => void,
  onFilterChange: (Filter: Filters) => void,
};

export enum Filters {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

export const Filter: React.FC<Props> = ({
  filter,
  isCompleted,
  todos,
  onCompletedClear,
  onFilterChange,
}) => {
  const compareFilter = (filterName: Filters) => {
    return classNames(
      'filter__link',
      {
        selected: filter === filterName,
      },
    );
  };

  const activeTodos = todos.filter(todo => !todo.completed).length;

  return (
    <>
      <footer className="todoapp__footer" data-cy="Footer">
        <span className="todo-count" data-cy="todosCounter">
          {`${activeTodos} items left`}
        </span>

        <nav className="filter" data-cy="Filter">
          <a
            data-cy="FilterLinkAll"
            href="#/"
            className={compareFilter(Filters.All)}
            onClick={() => onFilterChange(Filters.All)}
          >
            All
          </a>

          <a
            data-cy="FilterLinkActive"
            href="#/active"
            className={compareFilter(Filters.Active)}
            onClick={() => onFilterChange(Filters.Active)}
          >
            Active
          </a>
          <a
            data-cy="FilterLinkCompleted"
            href="#/completed"
            className={compareFilter(Filters.Completed)}
            onClick={() => onFilterChange(Filters.Completed)}
          >
            Completed
          </a>
        </nav>

        <button
          data-cy="ClearCompletedButton"
          type="button"
          className="todoapp__clear-completed"
          onClick={onCompletedClear}
          style={!isCompleted
            ? { visibility: 'hidden' }
            : {}}
        >
          Clear completed
        </button>
      </footer>
    </>
  );
};
