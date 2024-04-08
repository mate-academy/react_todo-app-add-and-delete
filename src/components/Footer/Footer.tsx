import React from 'react';
import cn from 'classnames';
import { useTodos } from '../Store/Store';
import { FilterBy } from '../../types/FilterBy';

const Footer: React.FC = () => {
  const { filter, setFilter, filteredTodos } = useTodos();

  const handleChangeType = (filters: FilterBy) => () => {
    setFilter(filters);
  };

  const itemsLeft = filteredTodos.filter(todo => !todo.completed);
  const completedLeft = filteredTodos.filter(todo => todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${itemsLeft.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          data-cy="FilterLinkAll"
          onClick={handleChangeType(FilterBy.ALL)}
          className={cn('filter__link', {
            selected: filter === FilterBy.ALL,
          })}
        >
          All
        </a>

        <a
          href="#/active"
          data-cy="FilterLinkActive"
          onClick={handleChangeType(FilterBy.ACTIVE)}
          className={cn('filter__link', {
            selected: filter === FilterBy.ACTIVE,
          })}
        >
          Active
        </a>

        <a
          href="#/completed"
          data-cy="FilterLinkCompleted"
          onClick={handleChangeType(FilterBy.COMPLETED)}
          className={cn('filter__link', {
            selected: filter === FilterBy.COMPLETED,
          })}
        >
          Completed
        </a>
      </nav>

      {completedLeft.length > 0 && (
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          onClick={clearCompleted}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};

export default Footer;
