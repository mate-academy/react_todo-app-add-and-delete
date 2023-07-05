import React from 'react';
import cn from 'classnames';
import { Filters } from '../types/Filter';
import { Todo } from '../types/Todo';

interface Props {
  completedTodos: Todo[];
  uncompletedTodos: Todo[];
  filter: Filters,
  setFilter: React.Dispatch<React.SetStateAction<Filters>>
  handleClearCompleted: () => void
}

export const TodoFooter: React.FC<Props> = ({
  completedTodos,
  uncompletedTodos,
  filter,
  setFilter,
  handleClearCompleted,
}) => {
  const handleOnClick = (
    selectedFilter: Filters,
  ) => {
    setFilter(selectedFilter);
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${uncompletedTodos.length} items left`}
      </span>

      <nav className="filter">
        {Object.entries(Filters).map(([key, value]) => (
          <a
            href={`#/${key}`}
            className={cn(
              'filter__link',
              { selected: filter === value },
            )}
            key={key}
            onClick={() => handleOnClick(value)}
          >
            {key}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        disabled={!completedTodos.length}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
