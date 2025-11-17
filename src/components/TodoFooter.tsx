import React from 'react';
import { Filter } from '../types/Filter';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

type Props = {
  todos: Todo[];
  filter: Filter;
  handleFilterClick: (
    value: Filter,
  ) => (event: React.MouseEvent<HTMLAnchorElement>) => void;
  onClearCompleted: () => void;
};

type FilterMeta = {
  label: string;
  href: string;
  dataCy: string;
};

const filtersMeta: Record<Filter, FilterMeta> = {
  [Filter.All]: {
    label: 'All',
    href: '#/',
    dataCy: 'FilterLinkAll',
  },
  [Filter.Active]: {
    label: 'Active',
    href: '#/active',
    dataCy: 'FilterLinkActive',
  },
  [Filter.Completed]: {
    label: 'Completed',
    href: '#/completed',
    dataCy: 'FilterLinkCompleted',
  },
};

export const TodoFooter: React.FC<Props> = ({
  todos,
  filter,
  handleFilterClick,
  onClearCompleted,
}) => {
  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const hasCompletedTodos = todos.some(todo => todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(Filter).map(value => {
          const { label, href, dataCy } = filtersMeta[value as Filter];

          return (
            <a
              key={value}
              href={href}
              className={classNames('filter__link', {
                selected: filter === value,
              })}
              data-cy={dataCy}
              onClick={handleFilterClick(value as Filter)}
            >
              {label}
            </a>
          );
        })}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompletedTodos}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
