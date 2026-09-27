import React from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';
import { Filter } from '../../types/Filter';

type Props = {
  todos: Todo[];
  filter: Filter;
  onFilterChange: (filter: Filter) => void;
  onClearCompleted: () => void;
};

const filters = [
  {
    href: '#/',
    filter: Filter.All,
    text: 'All',
    dataCy: 'FilterLinkAll',
  },

  {
    href: '#/active',
    filter: Filter.Active,
    text: 'Active',
    dataCy: 'FilterLinkActive',
  },

  {
    href: '#/completed',
    filter: Filter.Completed,
    text: 'Completed',
    dataCy: 'FilterLinkCompleted',
  },
];

export const Footer: React.FC<Props> = ({
  todos,
  filter,
  onFilterChange,
  onClearCompleted,
}) => {
  const hasCompleteTodos = todos.some(todo => todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todos.filter(todo => !todo.completed).length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {filters.map(link => (
          <a
            key={link.text}
            href={link.href}
            data-cy={link.dataCy}
            className={cn('filter__link', {
              selected: filter === link.filter,
            })}
            onClick={() => onFilterChange(link.filter)}
          >
            {link.text}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompleteTodos}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
