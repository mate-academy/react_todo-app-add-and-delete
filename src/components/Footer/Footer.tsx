import classNames from 'classnames';
import { FilterType } from '../../types/FilterType';
import { Todo } from '../../types/Todo';

type Props = {
  activeTodos: Todo[];
  filterBy: FilterType;
  setFilterBy: (arg0: FilterType) => void;
};

export const Footer: React.FC<Props> = ({
  activeTodos,
  filterBy,
  setFilterBy,
}) => (
  <footer className="todoapp__footer" data-cy="Footer">
    <span className="todo-count" data-cy="todosCounter">
      {`${activeTodos.length} items left`}
    </span>

    <nav className="filter" data-cy="Filter">
      <a
        data-cy="FilterLinkAll"
        href="#/"
        className={classNames(
          'filter__link',
          {
            selected: filterBy === FilterType.All,
          },
        )}
        onClick={() => setFilterBy(FilterType.All)}
      >
        All
      </a>

      <a
        data-cy="FilterLinkActive"
        href="#/active"
        className={classNames(
          'filter__link',
          {
            selected: filterBy === FilterType.Active,
          },
        )}
        onClick={() => setFilterBy(FilterType.Active)}
      >
        Active
      </a>
      <a
        data-cy="FilterLinkCompleted"
        href="#/completed"
        className={classNames(
          'filter__link',
          {
            selected: filterBy === FilterType.Completed,
          },
        )}
        onClick={() => setFilterBy(FilterType.Completed)}
      >
        Completed
      </a>
    </nav>

    <button
      data-cy="ClearCompletedButton"
      type="button"
      className="todoapp__clear-completed"
    >
      Clear completed
    </button>
  </footer>
);
