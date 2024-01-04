import React, { useContext } from 'react';
import cn from 'classnames';
import { FilterBy } from '../../types/Filter';
import { AppContext } from '../../ContextProvider/AppContext';

export const Footer: React.FC = (() => {
  const {
    filterBy,
    todos,
    setFilterBy,
    clearCompleted,
  } = useContext(AppContext);

  const countUncompletedTodo = todos
    .filter(todo => !todo.completed).length;

  const isSomeTodosCompleted = todos.some(todo => todo.completed);

  const handleFilterChange = (filter: FilterBy) => () => {
    setFilterBy(filter);
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${countUncompletedTodo} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          data-cy="FilterLinkAll"
          className={cn(
            'filter__link',
            { selected: filterBy === FilterBy.All },
          )}
          onClick={handleFilterChange(FilterBy.All)}
        >
          All
        </a>

        <a
          href="#/active"
          data-cy="FilterLinkActive"
          className={cn(
            'filter__link',
            { selected: filterBy === FilterBy.Active },
          )}
          onClick={handleFilterChange(FilterBy.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          data-cy="FilterLinkCompleted"
          className={cn(
            'filter__link',
            { selected: filterBy === FilterBy.Completed },
          )}
          onClick={() => setFilterBy(FilterBy.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className={cn('todoapp__clear-completed', {
          disabled: !isSomeTodosCompleted,
        })}
        data-cy="ClearCompletedButton"
        disabled={!isSomeTodosCompleted}
        onClick={clearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
});
