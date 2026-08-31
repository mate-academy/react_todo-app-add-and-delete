import React from 'react';
import classNames from 'classnames';
import { Filter } from './types';

const filterOptions = [
  { value: Filter.All, label: 'All', dataCy: 'FilterLinkAll' },
  { value: Filter.Active, label: 'Active', dataCy: 'FilterLinkActive' },
  {
    value: Filter.Completed,
    label: 'Completed',
    dataCy: 'FilterLinkCompleted',
  },
] as const;

type Props = {
  activeTodosCount: number;
  filter: Filter;
  hasCompletedTodos: boolean;
  hasTodos: boolean;
  onFilterChange: (filter: Filter) => void;
  onClearCompleted: () => void;
};

export const TodoFooter: React.FC<Props> = ({
  activeTodosCount,
  filter,
  hasCompletedTodos,
  hasTodos,
  onFilterChange,
  onClearCompleted,
}) => (
  <footer className="todoapp__footer">
    <span className="todoapp__count" data-cy="TodosCounter">
      {`${activeTodosCount} item${activeTodosCount === 1 ? '' : 's'} left`}
    </span>

    {hasTodos && (
      <div className="todoapp__filters" data-cy="Filter">
        {filterOptions.map(option => (
          <button
            key={option.value}
            type="button"
            className={classNames('todoapp__filter', {
              selected: filter === option.value,
            })}
            data-cy={option.dataCy}
            onClick={() => onFilterChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    )}

    {hasTodos && (
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onClearCompleted}
        disabled={!hasCompletedTodos}
      >
        Clear completed
      </button>
    )}
  </footer>
);
