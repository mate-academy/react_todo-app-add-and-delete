import React from 'react';
import PropTypes from 'prop-types';
import { Todo } from '../types/Todo';
import { FilterBy } from '../types/FilterBy';
import classNames from 'classnames';
import { ClearCompletedButton } from './ClearCompletedButton';

export interface FooterProps {
  todos: Todo[];
  filterBy: FilterBy;
  setFilterBy: React.Dispatch<React.SetStateAction<FilterBy>>;
  onClearCompleted: () => Promise<void>;
  isClearingCompleted?: boolean;
}
export const Footer: React.FC<FooterProps> = ({
  todos,
  filterBy,
  setFilterBy,
  onClearCompleted,
  isClearingCompleted = false,
}) => {
  const amountOfActiveTodo = todos.filter(todo => !todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter" aria-live="polite">
        {amountOfActiveTodo} {amountOfActiveTodo === 1 ? 'item' : 'items'} left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" aria-label="Todo Filters" data-cy="Filter">
        {Object.values(FilterBy).map(filterValue => (
          <a
            key={filterValue}
            href={`#/${filterValue}`}
            className={classNames('filter__link', {
              selected: filterBy === filterValue,
            })}
            data-cy={`FilterLink${filterValue}`}
            onClick={() => setFilterBy(filterValue)}
            aria-current={filterBy === filterValue ? 'page' : undefined}
          >
            {filterValue}
          </a>
        ))}
      </nav>

      {/* This button should be disabled if there are no completed todos */}
      <ClearCompletedButton
        onClearCompleted={onClearCompleted}
        isClearingCompleted={isClearingCompleted}
        hasCompletedTodo={todos.some(todo => todo.completed)}
      />
    </footer>
  );
};

// PropTypes for runtime type checking
Footer.propTypes = {
  todos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      userId: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      completed: PropTypes.bool.isRequired,
    }).isRequired,
  ).isRequired,
  filterBy: PropTypes.oneOf(Object.values(FilterBy) as FilterBy[]).isRequired,
  setFilterBy: PropTypes.func.isRequired,
};
