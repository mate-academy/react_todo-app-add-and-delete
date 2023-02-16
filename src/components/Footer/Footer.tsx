import classNames from 'classnames';
import React from 'react';
import { FilterBy } from '../../types/FilterBy';

type Props = {
  howManyActiveTodosLeft: number,
  hasCompletedTodos: boolean,
  filterBy: FilterBy,
  onFilterBy: (filterBy: FilterBy) => void,
  onDeleteCopletedTodos: () => void,
};

export const Footer:React.FC<Props> = ({
  howManyActiveTodosLeft,
  hasCompletedTodos,
  filterBy,
  onFilterBy,
  onDeleteCopletedTodos,
}) => (
  <footer className="todoapp__footer">
    <span className="todo-count">
      {`${howManyActiveTodosLeft} items left`}
    </span>

    <nav className="filter">
      <a
        href="#/"
        className={classNames(
          'filter__link',
          { selected: FilterBy.ALL === filterBy },
        )}
        onClick={() => onFilterBy(FilterBy.ALL)}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames(
          'filter__link',
          { selected: FilterBy.ACTIVE === filterBy },
        )}
        onClick={() => onFilterBy(FilterBy.ACTIVE)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames(
          'filter__link',
          { selected: FilterBy.COMPLETED === filterBy },
        )}
        onClick={() => onFilterBy(FilterBy.COMPLETED)}
      >
        Completed
      </a>
    </nav>

    <button
      type="button"
      className="todoapp__clear-completed"
      onClick={onDeleteCopletedTodos}
    >
      {hasCompletedTodos && 'Clear completed'}
    </button>

  </footer>
);
