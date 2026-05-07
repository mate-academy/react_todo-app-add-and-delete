import React from 'react';
import cn from 'classnames';
import { Filter } from '../../enums/Filter';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  activeCount: number;
  filter: Filter;
  setFilter: (filter: Filter) => void;
  onClearCompleted: () => void;
};

const filters = [
  { label: 'All', value: Filter.All, href: '#/', cy: 'FilterLinkAll' },
  {
    label: 'Active',
    value: Filter.Active,
    href: '#/active',
    cy: 'FilterLinkActive',
  },
  {
    label: 'Completed',
    value: Filter.Completed,
    href: '#/completed',
    cy: 'FilterLinkCompleted',
  },
];

export const Footer: React.FC<Props> = ({
  todos,
  activeCount,
  filter,
  setFilter,
  onClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span data-cy="TodosCounter">{`${activeCount} items left`}</span>

      <nav className="filter" data-cy="Filter">
        {filters.map(f => (
          <a
            key={f.value}
            href={f.href}
            data-cy={f.cy}
            className={cn('filter__link', {
              selected: filter === f.value,
            })}
            onClick={() => setFilter(f.value)}
          >
            {f.label}
          </a>
        ))}
      </nav>

      <button
        type="button"
        data-cy="ClearCompletedButton"
        className="todoapp__clear-completed"
        disabled={!todos.some(todo => todo.completed)}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
