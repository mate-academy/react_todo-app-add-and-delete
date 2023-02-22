import React from 'react';
import classNames from 'classnames';
import { Filter } from '../../types/Filter';

type Props = {
  filterType: Filter;
  setFilterTypeWrapper: (value: Filter) => void;
  completedTodos: number;
  todosCounter: number;
  deleteCompletedTodos : () => void;
};

export const Footer: React.FC<Props> = React.memo(
  ({
    filterType,
    setFilterTypeWrapper,
    completedTodos,
    todosCounter,
    deleteCompletedTodos,
  }) => {
    const handleClearButtonClick = () => {
      deleteCompletedTodos();
    };

    return (
      <footer className="todoapp__footer">
        <span className="todo-count">
          {`${todosCounter} items left`}
        </span>

        <nav className="filter">
          <a
            href="#/"
            className={classNames(
              'filter__link',
              {
                selected: filterType === Filter.ALL,
              },
            )}
            onClick={() => setFilterTypeWrapper(Filter.ALL)}
          >
            All
          </a>

          <a
            href="#/active"
            className={classNames(
              'filter__link',
              {
                selected: filterType === Filter.ACTIVE,
              },
            )}
            onClick={() => setFilterTypeWrapper(Filter.ACTIVE)}
          >
            Active
          </a>

          <a
            href="#/completed"
            className={classNames(
              'filter__link',
              {
                selected: filterType === Filter.COMPLETED,
              },
            )}
            onClick={() => setFilterTypeWrapper(Filter.COMPLETED)}
          >
            Completed
          </a>
        </nav>

        {completedTodos !== 0 && (
          <button
            type="button"
            className="todoapp__clear-completed"
            onClick={() => handleClearButtonClick()}
          >
            Clear completed
          </button>
        )}
      </footer>
    );
  },
);
