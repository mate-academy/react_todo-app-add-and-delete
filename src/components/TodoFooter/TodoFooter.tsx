import React from 'react';
import { Todo } from '../../types/Todo';
import { Filter } from '../../types/Enum';

type Props = {
  todos: Todo[];
  currentFilter: Filter;
  onFilterChange: (filter: Filter) => void;
  onDeletedCompleted: () => void;
};

const FILTER_LINKS: {
  label: string;
  value: Filter;
  href: string;
  dataCy: string;
}[] = [
  { label: 'All', value: Filter.All, href: '#/', dataCy: 'FilterLinkAll' },
  {
    label: 'Active',
    value: Filter.Active,
    href: '#/active',
    dataCy: 'FilterLinkActive',
  },
  {
    label: 'Completed',
    value: Filter.Completed,
    href: '#/completed',
    dataCy: 'FilterLinkCompleted',
  },
];

export const TodoFooter: React.FC<Props> = ({
  todos,
  currentFilter,
  onFilterChange,
  onDeletedCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todos.filter(todo => !todo.completed).length} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {FILTER_LINKS.map(({ label, value, href, dataCy }) => (
          <a
            key={value}
            href={href}
            className={`filter__link ${currentFilter === value ? 'selected' : ''}`}
            data-cy={dataCy}
            onClick={() => onFilterChange(value)}
          >
            {label}
          </a>
        ))}
      </nav>

      <button
        type="button"
        disabled={todos.every(todo => !todo.completed)}
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onDeletedCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
