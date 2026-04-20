import React from 'react';
import { FilterStatus } from '../types/FilterStatus';
import classNames from 'classnames';

type Props = {
  filter: FilterStatus;
  setFilter: (filter: FilterStatus) => void;
  hasCompletedTodo: boolean;
  itemsLeft: number;
  onClearCompletedTodos: () => Promise<void>;
};

const FooterComponent: React.FC<Props> = ({
  itemsLeft,
  setFilter,
  filter,
  hasCompletedTodo,
  onClearCompletedTodos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {itemsLeft} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(FilterStatus).map(filterValue => (
          <a
            key={filterValue}
            onClick={() => setFilter(filterValue)}
            href={
              filterValue === FilterStatus.All
                ? '#/'
                : `#/${filterValue.toLowerCase()}`
            }
            className={classNames('filter__link', {
              selected: filter === filterValue,
            })}
            data-cy={`FilterLink${filterValue}`}
          >
            {filterValue}
          </a>
        ))}
      </nav>

      <button
        disabled={!hasCompletedTodo}
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={() => onClearCompletedTodos()}
      >
        Clear completed
      </button>
    </footer>
  );
};

export const Footer = React.memo(FooterComponent);
