import React, { Dispatch, SetStateAction } from 'react';
import cn from 'classnames';
import { TodoFilter } from '../types/TodoFilter';

type Props = {
  currentFilter: TodoFilter;
  onFilterChange: Dispatch<SetStateAction<TodoFilter>>;
  todosLeft: number;
  completedTodos: number;
  onDeleteCompletedTodos: () => void;
};

export const TodoFooter: React.FC<Props> = ({
  currentFilter,
  onFilterChange,
  todosLeft,
  completedTodos,
  onDeleteCompletedTodos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todosLeft} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {Object.values(TodoFilter).map(filter => (
          <a
            key={filter}
            href={`#/${filter.toLowerCase()}`}
            className={cn('filter__link', {
              selected: currentFilter === filter,
            })}
            data-cy={`FilterLink${filter}`}
            onClick={() => onFilterChange(filter)}
          >
            {filter}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onDeleteCompletedTodos}
        disabled={!completedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
