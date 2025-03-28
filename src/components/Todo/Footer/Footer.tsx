import React from 'react';
import { FilterOption } from '../../../types/FilterOptions';
import { Todo } from '../../../types/Todo';
import classNames from 'classnames';
import { TodoRemoveCompletedHandler } from '../../../types/TodoMethods';

type Props = {
  todos: Todo[];
  filterBy: FilterOption;
  onFilterChange: (newValue: FilterOption) => void;
  onDeleteCompleted: TodoRemoveCompletedHandler;
};

const filterOptions = [
  { type: FilterOption.ALL, label: 'All', href: '#/' },
  { type: FilterOption.ACTIVE, label: 'Active', href: '#/active' },
  { type: FilterOption.COMPLETED, label: 'Completed', href: '#/completed' },
];

export const TodoFooter: React.FC<Props> = React.memo(
  ({ filterBy, onFilterChange, todos, onDeleteCompleted }) => {
    const itemsLeftCount = todos.filter(todo => !todo.completed).length;
    const completedItemsCount = todos.length - itemsLeftCount;

    return (
      <footer className="todoapp__footer" data-cy="Footer">
        <span className="todo-count" data-cy="TodosCounter">
          {itemsLeftCount} item{itemsLeftCount !== 1 ? 's' : ''} left
        </span>

        <nav className="filter" data-cy="Filter">
          {filterOptions.map(({ type, label, href }) => (
            <a
              key={type}
              href={href}
              className={classNames('filter__link', {
                selected: filterBy === type,
              })}
              data-cy={`FilterLink${label}`}
              onClick={() => onFilterChange(type)}
            >
              {label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          disabled={completedItemsCount === 0}
          onClick={onDeleteCompleted}
        >
          Clear completed
        </button>
      </footer>
    );
  },
);

TodoFooter.displayName = 'TodoFooter';
