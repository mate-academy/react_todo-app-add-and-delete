import { FC } from 'react';
import classNames from 'classnames';
import { Filter } from '../../types/Filter';

type Props = {
  onFilter: (arg: Filter) => void,
  filterType: Filter,
  containsCompleted: boolean,
  onClearCompleted: () => void,
};

export const Footer: FC<Props> = ({
  onFilter,
  filterType,
  containsCompleted,
  onClearCompleted,
}) => (
  <footer className="todoapp__footer">
    <span className="todo-count">
      3 items left
    </span>

    <nav className="filter">
      <a
        href="#/"
        className={classNames(
          'filter__link',
          { selected: filterType === Filter.All },
        )}
        onClick={() => onFilter(Filter.All)}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames(
          'filter__link',
          { selected: filterType === Filter.Active },
        )}
        onClick={() => onFilter(Filter.Active)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames(
          'filter__link',
          { selected: filterType === Filter.Completed },
        )}
        onClick={() => onFilter(Filter.Completed)}
      >
        Completed
      </a>
    </nav>

    {/* don't show this button if there are no completed todos */}
    <button
      type="button"
      className="todoapp__clear-completed"
      style={{ visibility: containsCompleted ? 'visible' : 'hidden' }}
      onClick={() => {
        onClearCompleted();
      }}
    >
      Clear completed
    </button>
  </footer>
);
