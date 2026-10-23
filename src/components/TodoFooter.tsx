import cn from 'classnames';
import React from 'react';
import { Todo } from '../types/Todo';
import { Status } from '../types/Status';
import { FilterLinkType } from '../types/FilterLinkType';

type Props = {
  todos: Todo[];
  selectedFilter: Status;
  onSelected: (path: Status) => void;
  onReset: () => void;
};

const FILTER_LINKS: FilterLinkType[] = [
  {
    path: 'all',
    title: 'All',
    cy: 'FilterLinkAll',
  },
  { path: 'active', title: 'Active', cy: 'FilterLinkActive' },
  { path: 'completed', title: 'Completed', cy: 'FilterLinkCompleted' },
];

export const TodoFooter: React.FC<Props> = ({
  todos,
  selectedFilter,
  onSelected,
  onReset,
}) => {
  const hasCompleted = todos.some(todo => todo.completed);
  const activeCount = todos.filter(todo => !todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {FILTER_LINKS.map(link => (
          <a
            key={link.path}
            href={`#/${link.path}`}
            className={cn('filter__link', {
              selected: link.path === selectedFilter,
            })}
            data-cy={link.cy}
            onClick={() => onSelected(link.path)}
          >
            {link.title}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompleted}
        onClick={onReset}
      >
        Clear completed
      </button>
    </footer>
  );
};
