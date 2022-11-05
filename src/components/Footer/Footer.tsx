import classNames from 'classnames';
import { FilterType } from '../../types/FilterType';

type Props = {
  todosCount: number,
  todosLeft: number,
  filterType: FilterType,
  setFilterType: (value: FilterType) => void,
  clearCompleted: () => void,
};

export const Footer: React.FC<Props> = ({
  todosCount,
  todosLeft,
  filterType,
  setFilterType,
  clearCompleted,
}) => (
  <footer className="todoapp__footer" data-cy="Footer">
    <span className="todo-count" data-cy="todosCounter">
      {`${todosLeft} items left`}
    </span>

    <nav className="filter" data-cy="Filter">
      <a
        data-cy="FilterLinkAll"
        href="#/"
        className={classNames(
          'filter__link', { selected: filterType === FilterType.ALL },
        )}
        onClick={() => setFilterType(FilterType.ALL)}
      >
        All
      </a>

      <a
        data-cy="FilterLinkActive"
        href="#/active"
        className={classNames(
          'filter__link', { selected: filterType === FilterType.ACTIVE },
        )}
        onClick={() => setFilterType(FilterType.ACTIVE)}
      >
        Active
      </a>
      <a
        data-cy="FilterLinkCompleted"
        href="#/completed"
        className={classNames(
          'filter__link', { selected: filterType === FilterType.COMPLETED },
        )}
        onClick={() => setFilterType(FilterType.COMPLETED)}
      >
        Completed
      </a>
    </nav>

    <button
      data-cy="ClearCompletedButton"
      type="button"
      className="todoapp__clear-completed"
      onClick={clearCompleted}
      disabled={todosCount === todosLeft}
    >
      Clear completed
    </button>
  </footer>
);
