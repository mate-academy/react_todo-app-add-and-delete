import React from 'react';
import { Filters } from '../types/Filters';
import { Todo } from '../types/Todo';

interface Props {
  currentFilter: Filters;
  onFilterChange: (filter: Filters) => void;
  todos: Todo[];
  activeTodosCount: number;
  onClearCompleted: () => void;
}

export const TodoFilter: React.FC<Props> = ({
  currentFilter,
  onFilterChange,
  todos,
  activeTodosCount,
  onClearCompleted,
}) => {
  const completedTodosCount = todos.length - activeTodosCount;

  const filterLinks = Object.values(Filters).map(filter => (
    <a
      key={filter}
      href={`#/${filter.toLowerCase()}`}
      className={`filter__link ${currentFilter === filter ? 'selected' : ''}`}
      data-cy={`FilterLink${filter}`}
      onClick={() => onFilterChange(filter)}
    >
      {filter}
    </a>
  ));

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {filterLinks}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        onClick={onClearCompleted}
        data-cy="ClearCompletedButton"
        disabled={completedTodosCount === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
