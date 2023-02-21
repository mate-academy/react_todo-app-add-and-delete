import React from 'react';
import classNames from 'classnames';
import { Filter } from '../../types/Filter';
// import { Todo } from '../../types/Todo';

type Props = {
  filterType: Filter;
  onFilterTypeChange: (value: Filter) => void;
  completedTodos: number;
  activeTodos: number;
  deleteCompletedTodos : () => void;
};

export const TodoFilter: React.FC<Props> = React.memo(
  (
    {
      filterType,
      onFilterTypeChange,
      completedTodos,
      activeTodos,
      deleteCompletedTodos,
    },
  ) => {
    const changeFilterType = (newFilterType: Filter) => {
      onFilterTypeChange(newFilterType);
    };

    const handleClearButtonClick = () => {
      deleteCompletedTodos();
    };

    return (
      <footer className="todoapp__footer">
        <span className="todo-count">
          {`${activeTodos} items left`}
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
            onClick={() => changeFilterType(Filter.ALL)}
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
            onClick={() => changeFilterType(Filter.ACTIVE)}
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
            onClick={() => changeFilterType(Filter.COMPLETED)}
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
