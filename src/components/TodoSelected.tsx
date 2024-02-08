import React, { useState } from 'react';
import cn from 'classnames';
import { FilterTodos } from '../types/FilterTodos';

type Props = {
  onTodoSelected: (value: FilterTodos) => void;
  filter: string;
};

export const TodoSelecet: React.FC<Props> = ({ onTodoSelected, filter }) => {
  const [defaultActiveSelect, setDefaultActiveSelect] = useState(true);

  const handleFilterAll = () => {
    onTodoSelected(FilterTodos.all);
    setDefaultActiveSelect(true);
  };

  const handleFilterActive = () => {
    onTodoSelected(FilterTodos.active);
    setDefaultActiveSelect(false);
  };

  const handleFilterCompleted = () => {
    onTodoSelected(FilterTodos.completed);
    setDefaultActiveSelect(false);
  };

  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={cn('filter__link', {
          'filter__link selected': defaultActiveSelect,
        })}
        data-cy="FilterLinkAll"
        onClick={handleFilterAll}
      >
        All
      </a>

      <a
        href="#/active"
        className={cn('filter__link', {
          'filter__link selected': FilterTodos.active === filter,
        })}
        data-cy="FilterLinkActive"
        onClick={handleFilterActive}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={cn('filter__link', {
          'filter__link selected': FilterTodos.completed === filter,
        })}
        data-cy="FilterLinkCompleted"
        onClick={handleFilterCompleted}
      >
        Completed
      </a>
    </nav>
  );
};
