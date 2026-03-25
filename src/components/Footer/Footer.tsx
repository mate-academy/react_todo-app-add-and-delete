import React from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';
import { Filter } from '../../types/Filter';

type TFilter = {
  label: string;
  value: Filter;
  href: string;
  dataCy: string;
};

type Props = {
  todos: Todo[];
  selected: Filter;
  setSelected: React.Dispatch<React.SetStateAction<Filter>>;
  onReset: () => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  selected,
  setSelected,
  onReset,
}) => {
  const count = todos.filter(todo => !todo.completed).length;

  const filters: TFilter[] = [
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

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${count} items left`}
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {filters.map(f => (
          <a
            key={f.value}
            href={f.href}
            data-cy={f.dataCy}
            className={classNames('filter-link', {
              selected: selected === f.value,
            })}
            onClick={() => setSelected(f.value)}
          >
            {f.label}
          </a>
        ))}
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={todos.every(todo => !todo.completed)}
        onClick={onReset}
      >
        Clear completed
      </button>
    </footer>
  );
};
