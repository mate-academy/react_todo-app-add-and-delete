import classNames from 'classnames';
import React from 'react';
import { Filter } from '../types/Filter';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  filter: Filter;
  onClick: (filterName: Filter) => void;
  onClearCompleted: () => void;
};

export const Footer: React.FC<Props> = React.memo(
  ({ todos, filter, onClick, onClearCompleted }) => {
    const handleFiltering = (
      e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
      trigger: Filter,
    ) => {
      e.preventDefault();
      onClick(trigger);
    };

    const normalizeFilterName = (filterName: string) =>
      filterName[0].toUpperCase() + filterName.slice(1);

    const filterLinkKeys = {
      all: 'FilterLinkAll',
      active: 'FilterLinkActive',
      completed: 'FilterLinkCompleted',
    };

    return (
      <footer className="todoapp__footer" data-cy="Footer">
        <span className="todo-count" data-cy="TodosCounter">
          {todos.filter(todo => !todo.completed).length} items left
        </span>

        {/* Active link should have the 'selected' class */}
        <nav className="filter" data-cy="Filter">
          {Object.values(Filter).map((filterName: Filter) => (
            <a
              key={filterName}
              href="#/"
              className={classNames('filter__link', {
                selected: filter === filterName,
              })}
              data-cy={filterLinkKeys[filterName]}
              onClick={e => handleFiltering(e, filterName)}
            >
              {normalizeFilterName(filterName)}
            </a>
          ))}
        </nav>

        {/* this button should be disabled if there are no completed todos */}
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          disabled={todos.filter(todo => todo.completed).length === 0}
          onClick={onClearCompleted}
        >
          Clear completed
        </button>
      </footer>
    );
  },
);

Footer.displayName = 'Footer';
