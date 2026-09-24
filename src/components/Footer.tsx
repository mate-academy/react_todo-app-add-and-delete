import React from 'react';
import cn from 'classnames';
import { FilterType } from '../types/FilterType';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  onClearCompleted: () => void;
};

type FilterLink = {
  value: FilterType;
  href: string;
  label: string;
  dataCy: string;
};

const FILTER_LINKS: FilterLink[] = [
  { value: FilterType.all, href: '#/', label: 'All', dataCy: 'FilterLinkAll' },
  {
    value: FilterType.active,
    href: '#/active',
    label: 'Active',
    dataCy: 'FilterLinkActive',
  },
  {
    value: FilterType.completed,
    href: '#/completed',
    label: 'Completed',
    dataCy: 'FilterLinkCompleted',
  },
];

export const Footer: React.FC<Props> = ({
  todos,
  filter,
  onFilterChange,
  onClearCompleted,
}) => {
  const activeCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.length - activeCount;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeCount} item${activeCount === 1 ? '' : 's'} left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {FILTER_LINKS.map(link => (
          <a
            key={link.value}
            href={link.href}
            className={cn('filter__link', {
              selected: filter === link.value,
            })}
            data-cy={link.dataCy}
            onClick={event => {
              event.preventDefault();
              onFilterChange(link.value);
            }}
          >
            {link.label}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedCount === 0}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
