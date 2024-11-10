import React, { useMemo, useCallback } from 'react';
import { Todo } from '../../types/Todo';
import { FilterOptions } from '../../App';

type Props = {
  todos: Todo[];
  filterOption: FilterOptions;
  setFilterOption: React.Dispatch<React.SetStateAction<FilterOptions>>;
  handleClearCompleted: () => void;
  isLoading: boolean;
};

export const Footer: React.FC<Props> = ({
  todos,
  filterOption,
  setFilterOption,
  handleClearCompleted,
  isLoading,
}) => {
  const activeTodos = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );

  const handleFilterChange = useCallback(
    (option: FilterOptions) => {
      setFilterOption(option);
    },
    [setFilterOption],
  );

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodos} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={`filter__link ${filterOption === FilterOptions.All ? 'selected' : ''}`}
          data-cy="FilterLinkAll"
          onClick={() => handleFilterChange(FilterOptions.All)}
        >
          All
        </a>
        <a
          href="#/active"
          className={`filter__link ${filterOption === FilterOptions.Active ? 'selected' : ''}`}
          data-cy="FilterLinkActive"
          onClick={() => handleFilterChange(FilterOptions.Active)}
        >
          Active
        </a>
        <a
          href="#/completed"
          className={`filter__link ${filterOption === FilterOptions.Completed ? 'selected' : ''}`}
          data-cy="FilterLinkCompleted"
          onClick={() => handleFilterChange(FilterOptions.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleClearCompleted}
        disabled={todos.every(todo => !todo.completed) || isLoading}
      >
        Clear completed
      </button>
    </footer>
  );
};
