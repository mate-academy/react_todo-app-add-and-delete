import React from 'react';
import cn from 'classnames';
import { FilterOptions } from '../../types/FilterOptions';

type Props = {
  filterOption: FilterOptions;
  onSetFilterOption: React.Dispatch<React.SetStateAction<FilterOptions>>;
  activeTodosCount: number;
  completedTodoIds: number[];
  deleteTodo: (id: number) => void;
};

export const TodoFooter: React.FC<Props> = React.memo(({
  filterOption,
  onSetFilterOption,
  activeTodosCount,
  completedTodoIds,
  deleteTodo,
}) => {
  const handleFilter = (filterField: FilterOptions) => {
    onSetFilterOption(filterField);
  };

  const handleDeleteCompleted = () => {
    completedTodoIds.forEach(todoId => {
      deleteTodo(todoId);
    });
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodosCount} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={cn(
            'filter__link',
            { selected: filterOption === FilterOptions.All },
          )}
          onClick={() => handleFilter(FilterOptions.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn(
            'filter__link',
            { selected: filterOption === FilterOptions.Active },
          )}
          onClick={() => handleFilter(FilterOptions.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn(
            'filter__link',
            { selected: filterOption === FilterOptions.Completed },
          )}
          onClick={() => handleFilter(FilterOptions.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        style={{ visibility: !completedTodoIds.length ? 'hidden' : 'visible' }}
        onClick={handleDeleteCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
});
