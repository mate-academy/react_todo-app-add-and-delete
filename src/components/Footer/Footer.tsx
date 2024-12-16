import React from 'react';
import { FilterTodosBy } from '../../utils/FilterTodosBy';
import cn from 'classnames';
import { Errors } from '../../utils/Errors';
interface Props {
  uncompletedTodos: number;
  filterBy: FilterTodosBy;
  setFilteredBy: (filterBy: FilterTodosBy) => void;
  hasError: Errors;
  setHasError: (hasError: Errors) => void;
  completedTodosLenght: number;
  handleDeleteAllCompleted: () => void;
}
export const Footer: React.FC<Props> = props => {
  const {
    uncompletedTodos,
    filterBy,
    setFilteredBy,
    completedTodosLenght,
    handleDeleteAllCompleted,
  } = props;

  const filters = [
    { label: 'All', value: FilterTodosBy.All, href: '#/' },
    { label: 'Active', value: FilterTodosBy.Active, href: '#/active' },
    { label: 'Completed', value: FilterTodosBy.Completed, href: '#/completed' },
  ];

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {uncompletedTodos} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {filters.map(filter => (
          <a
            key={filter.value}
            href={filter.href}
            className={cn('filter__link', {
              selected: filterBy === filter.value,
            })}
            data-cy={`FilterLink${filter.label}`}
            onClick={() => setFilteredBy(filter.value)}
          >
            {filter.label}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedTodosLenght === 0}
        onClick={handleDeleteAllCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
