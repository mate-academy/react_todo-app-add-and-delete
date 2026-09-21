import React from 'react';

import classNames from 'classnames';
import { Filter } from '../types/Filter';
import { Todo } from '../types/Todo';

type Props = {
  activeTodosCount: number;
  itemsWord: string;
  filter: Filter;
  setFilter: (filter: Filter) => void;
  todos: Todo[];
  handleClearCompleted: () => void;
};

const filters = [
  {
    status: Filter.All,
    label: 'All',
    dataCy: 'FilterLinkAll',
  },
  {
    status: Filter.Active,
    label: 'Active',
    dataCy: 'FilterLinkActive',
  },
  {
    status: Filter.Completed,
    label: 'Completed',
    dataCy: 'FilterLinkCompleted',
  },
];

export const Footer = ({
  activeTodosCount,
  itemsWord,
  filter,
  setFilter,
  todos,
  handleClearCompleted,
}: Props) => (
  <footer className="todoapp__footer" data-cy="Footer">
    <span className="todo-count" data-cy="TodosCounter">
      {activeTodosCount} {itemsWord} left
    </span>

    <nav className="filter" data-cy="Filter">
      {filters.map(filterItem => (
        <a
          key={filterItem.status}
          href="#/"
          className={classNames('filter__link', {
            selected: filter === filterItem.status,
          })}
          data-cy={filterItem.dataCy}
          onClick={event => {
            event.preventDefault();
            setFilter(filterItem.status);
          }}
        >
          {filterItem.label}
        </a>
      ))}
    </nav>

    <button
      type="button"
      className="todoapp__clear-completed"
      data-cy="ClearCompletedButton"
      disabled={!todos.some(todo => todo.completed)}
      onClick={handleClearCompleted}
    >
      Clear completed
    </button>
  </footer>
);
