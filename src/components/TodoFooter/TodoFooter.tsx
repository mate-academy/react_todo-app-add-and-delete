import React from 'react';
import cn from 'classnames';
import { FilterOptions } from '../../types/FilterOptions';
import { Todo } from '../../types/Todo';

interface Props{
  filterOption: FilterOptions;
  setFilterOption: (option: FilterOptions) => void;
  activeVisibleTodosLength: number;
  completedVisibleTodos: Todo[];
  deleteTodos: (todoIds: Todo[]) => void;
}

export const TodoFooter: React.FC<Props> = (
  {
    filterOption,
    setFilterOption,
    activeVisibleTodosLength,
    completedVisibleTodos,
    deleteTodos,
  },
) => {
  const isCompletedTodosPresent = completedVisibleTodos.length > 0;

  return (

    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeVisibleTodosLength} items left`}
      </span>

      <nav className="filter">
        {Object.values(FilterOptions).map((filter) => {
          const isSelected = filterOption === filter;

          return (
            <a
              href={`#/${filter}`}
              key={filter}
              className={cn(
                'filter__link',
                { selected: isSelected },
              )}
              onClick={() => setFilterOption(filter)}
            >
              {filter}
            </a>
          );
        })}
      </nav>

      {/* don't show this button if there are no completed todos */}

      <button
        type="button"
        className="todoapp__clear-completed"
        onClick={() => deleteTodos(completedVisibleTodos)}
        style={{
          visibility: isCompletedTodosPresent
            ? 'visible'
            : 'hidden',
        }}

      >
        Clear completed
      </button>

    </footer>
  );
};
