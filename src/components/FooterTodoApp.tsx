import React from 'react';
import cn from 'classnames';
import { FilterStatus, Todo } from '../types/Todo';

const filterOptions = [
  {
    title: 'All',
    href: '#/',
    dataCY: 'FilterLinkAll',
    status: FilterStatus.DEFAULT,
  },
  {
    title: 'Active',
    href: '#/active',
    dataCY: 'FilterLinkActive',
    status: FilterStatus.ACTIVE,
  },
  {
    title: 'Completed',
    href: '#/completed',
    dataCY: 'FilterLinkCompleted',
    status: FilterStatus.COMPLETED,
  },
];

interface Props {
  todos: Todo[];
  setFilterStatus: (status: FilterStatus) => void;
  filterStatus: FilterStatus;
  onClearCompleted: () => void;
}

export const FooterTodoApp: React.FC<Props> = ({
  todos,
  setFilterStatus,
  filterStatus,
  onClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todos.filter(todo => !todo.completed).length} items left`}
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {filterOptions.map(option => {
          return (
            <a
              key={option.title}
              href={option.href}
              className={cn('filter__link', {
                selected: filterStatus === option.status,
              })}
              data-cy={option.dataCY}
              onClick={() => setFilterStatus(option.status)}
            >
              {option.title}
            </a>
          );
        })}
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!todos.some(todo => todo.completed)}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
