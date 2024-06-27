import React from 'react';
import { SelectedFilter } from '../../types/SelectedFilter';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  itemsLeft: string;
  filter: SelectedFilter;
  onSetFilter: (filterType: SelectedFilter) => void;
  massDelete: (todoIds: number[]) => Promise<void>;
  isOneActive: () => Todo[];
  getCompletedId: () => number[];
};

export const Footer: React.FC<Props> = ({
  itemsLeft,
  filter,
  onSetFilter,
  massDelete,
  isOneActive,
  getCompletedId,
}) => {
  const filteredOptions = [
    {
      type: SelectedFilter.ALL,
      href: '#/',
      data: 'FilterLinkAll',
    },
    {
      type: SelectedFilter.ACTIVE,
      href: '#/active',
      data: 'FilterLinkActive',
    },
    {
      type: SelectedFilter.COMPLETED,
      href: '#/completed',
      data: 'FilterLinkCompleted',
    },
  ];

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {itemsLeft}
      </span>
      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {filteredOptions.map(({ type, href, data }) => (
          <a
            key={type}
            href={href}
            className={cn('filter__link', {
              selected: filter === type,
            })}
            data-cy={data}
            onClick={() => onSetFilter(type)}
          >
            {type}
          </a>
        ))}
      </nav>
      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={() => massDelete(getCompletedId())}
        disabled={isOneActive().length === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
