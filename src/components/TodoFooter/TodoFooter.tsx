import React from 'react';
import { TodoCompletionType } from '../../types/TodoCompletionType';
import { FilterButton } from '../FilterButton/FilterButton';

type Props = {
  selectedFilterOption: TodoCompletionType;
  onFilterSelect: (newFilterOption: TodoCompletionType) => void
  activeTodosCount: number;
  hasCompletedTodos: boolean;
};

export const TodoFooter: React.FC<Props> = ({
  selectedFilterOption,
  onFilterSelect,
  activeTodosCount,
  hasCompletedTodos,
}) => {
  return (
    <>
      <footer className="todoapp__footer">
        <span className="todo-count">
          {`${activeTodosCount} items left`}
        </span>

        <nav className="filter">
          <FilterButton
            filterOption={TodoCompletionType.All}
            isSelected={TodoCompletionType.All === selectedFilterOption}
            onFilterSelect={onFilterSelect}
          />

          <FilterButton
            filterOption={TodoCompletionType.Active}
            isSelected={TodoCompletionType.Active === selectedFilterOption}
            onFilterSelect={onFilterSelect}
          />

          <FilterButton
            filterOption={TodoCompletionType.Completed}
            isSelected={TodoCompletionType.Completed === selectedFilterOption}
            onFilterSelect={onFilterSelect}
          />
        </nav>

        <button
          type="button"
          className="todoapp__clear-completed"
          disabled={!hasCompletedTodos}
        >
          Clear completed
        </button>
      </footer>
    </>
  );
};
