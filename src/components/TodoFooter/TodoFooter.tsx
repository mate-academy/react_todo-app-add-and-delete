import classNames from 'classnames';
import React from 'react';

type FilterType = 'All' | 'Active' | 'Completed';

type Props = {
  activeTodosCount: number;
  onClearCompleted: () => void;
  isNoCompletedTodos: boolean;
  selectedFilter: string;
  onFilterChange: (filter: FilterType) => void;
};

export const TodoFooter: React.FC<Props> = ({
  activeTodosCount,
  onClearCompleted,
  isNoCompletedTodos,
  selectedFilter,
  onFilterChange,
}) => {
  const renderFilterLink = (filter: FilterType, text: string) => (
    <a
      href={`#/${filter}`.toLowerCase()}
      className={classNames('filter__link', {
        selected: selectedFilter === filter,
      })}
      data-cy={`FilterLink${text}`}
      onClick={() => onFilterChange(filter)}
    >
      {text}
    </a>
  );

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} items left
      </span>
      <nav className="filter" data-cy="Filter">
        {renderFilterLink('All', 'All')}
        {renderFilterLink('Active', 'Active')}
        {renderFilterLink('Completed', 'Completed')}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onClearCompleted}
        disabled={isNoCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
