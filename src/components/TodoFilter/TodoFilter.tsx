import React from 'react';
import { Filter } from '../../types/Filter';
import classNames from 'classnames';

type Props = {
  status: Filter;
  hasCompletedTodo: boolean;
  onChange: (sortedField: Filter) => void;
  clearAllCompleted: () => void;
};

export const TodoFilter: React.FC<Props> = ({
  onChange,
  status,
  hasCompletedTodo,
  clearAllCompleted,
}) => {
  return (
    <>
      <nav className="filter" data-cy="Filter">
        {Object.values(Filter).map(value => (
          <a
            key={value}
            href="#/"
            className={classNames('filter__link', {
              selected: value === status,
            })}
            data-cy={`FilterLink${value}`}
            onClick={() => onChange(value)}
          >
            {value}
          </a>
        ))}
      </nav>

      <button
        type="button"
        onClick={clearAllCompleted}
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompletedTodo}
      >
        Clear completed
      </button>
    </>
  );
};
