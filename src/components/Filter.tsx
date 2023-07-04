import React from 'react';
import classnames from 'classnames';

interface Props {
  countNotCompletedtodos: number,
  handleFilter: (value: string) => void,
  filter: string,
  handleRemoveCompletedTodos: () => void,
}

export const Filter: React.FC<Props> = ({
  countNotCompletedtodos,
  handleFilter,
  filter,
  handleRemoveCompletedTodos,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${countNotCompletedtodos} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classnames(
            'filter__link',
            { selected: filter === 'All' },
          )}
          onClick={() => handleFilter('All')}
        >
          All
        </a>

        <a
          href="#/active"
          className={classnames(
            'filter__link',
            { selected: filter === 'Active' },
          )}
          onClick={() => handleFilter('Active')}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classnames(
            'filter__link',
            { selected: filter === 'Completed' },
          )}
          onClick={() => handleFilter('Completed')}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        onClick={handleRemoveCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
