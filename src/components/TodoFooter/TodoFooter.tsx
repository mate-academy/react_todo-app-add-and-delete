import React from 'react';
import cn from 'classnames';
import { FilterBy } from '../../types/FilterBy';

type Props = {
  onChangeFilter: (value: FilterBy) => void;
  filterSelected: FilterBy;
  activeTodos: number;
  completedTodos: number;
  clearCompleted: () => void;
};

export const TodoFooter: React.FC<Props> = ({
  onChangeFilter,
  filterSelected,
  activeTodos,
  completedTodos,
  clearCompleted,
}) => {
  const filterButtons = Object.keys(FilterBy);

  const handleClickFilter = (filterName: string) => {
    const index = Object.keys(FilterBy).indexOf(filterName);
    const filter = Object.values(FilterBy)[index];

    onChangeFilter(filter);
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodos} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter">
        {filterButtons.map(button => (
          <a
            key={button}
            href={`#/${button === FilterBy.all ? '' : `${button}`}`}
            className={cn(
              'filter__link',
              { selected: button === filterSelected },
            )}
            onClick={() => handleClickFilter(button)}
          >
            {`${button.charAt(0).toLocaleUpperCase() + button.slice(1)}`}
          </a>
        ))}
      </nav>

      {/* don't show this button if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        disabled={completedTodos === 0}
        onClick={clearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
