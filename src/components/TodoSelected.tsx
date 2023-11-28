import React, { useState } from 'react';
import cn from 'classnames';
import { Filter } from '../types/Filter';

type Props = {
  onTodoSelected: (value: Filter) => void;
  filter: string;
};

export const TodoSelecet: React.FC<Props> = ({
  onTodoSelected,
  filter,
}) => {
  const [defaultActiveSelect, setDefaultActiveSelect] = useState(true);

  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={cn('filter__link', {
          'filter__link selected': defaultActiveSelect,
        })}
        data-cy="FilterLinkAll"
        onClick={() => {
          onTodoSelected(Filter.all);
          setDefaultActiveSelect(true);
        }}
      >
        All
      </a>

      <a
        href="#/active"
        className={cn('filter__link', {
          'filter__link selected': Filter.active === filter,
        })}
        data-cy="FilterLinkActive"
        onClick={() => {
          onTodoSelected(Filter.active);
          setDefaultActiveSelect(false);
        }}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={cn('filter__link', {
          'filter__link selected': Filter.completed === filter,
        })}
        data-cy="FilterLinkCompleted"
        onClick={() => {
          onTodoSelected(Filter.completed);
          setDefaultActiveSelect(false);
        }}
      >
        Completed
      </a>
    </nav>
  );
};
