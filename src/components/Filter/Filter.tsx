import React from 'react';
import cn from 'classnames';
import { FilterBy } from '../../types/FilterBy';
import { Todo } from '../../types/Todo';

interface Props {
  filterBy: FilterBy,
  setFilterBy: (param: FilterBy) => void
  todos: Todo[]
  removeCompletedTodos: () => void
}

export const Filter: React.FC<Props> = ({
  filterBy,
  setFilterBy,
  todos,
  removeCompletedTodos,
}) => {
  const leftTodos = todos.filter(todo => !todo.completed);

  const enableButton = todos.some(todo => todo.completed);

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${leftTodos.length} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={cn(
            'filter__link',
            { selected: filterBy === 'all' },
          )}
          onClick={() => setFilterBy(FilterBy.all)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn(
            'filter__link',
            { selected: filterBy === 'active' },
          )}
          onClick={() => setFilterBy(FilterBy.active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn(
            'filter__link',
            { selected: filterBy === 'completed' },
          )}
          onClick={() => setFilterBy(FilterBy.completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        disabled={!enableButton}
        onClick={() => removeCompletedTodos()}
      >
        Clear completed
      </button>

    </footer>
  );
};
