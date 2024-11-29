import React from 'react';
import { Todo } from '../types/Todo';
import { FilterType } from '../types/Filter';
import classNames from 'classnames';

interface FooterProps {
  todos: Todo[];
  filter: string;
  onFilterChange: (filter: string) => void;
  onClearCompleted: () => void;
  haveId: number[];
}

const Footer: React.FC<FooterProps> = ({
  todos,
  filter,
  onFilterChange,
  onClearCompleted,
}) => {
  const activeTodoCount = todos.filter(todo => !todo.completed).length;
  const hasCompletedTodos = todos.some(todo => todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodoCount} items left`}
      </span>
      <nav className="filter" data-cy="Filter">
        {Object.values(FilterType).map(filterType => (
          <button
            key={filterType}
            className={classNames('filter__link', {
              selected: filter === filterType,
            })}
            onClick={() => onFilterChange(filterType)}
          >
            {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
          </button>
        ))}
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

export default Footer;
