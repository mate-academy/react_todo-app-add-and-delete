import React from 'react';
import { Todo, TodoStatusFilter } from '../../types/Todo';
import { FilterButton } from '../FilterButton/FilterButton';

type Props = {
  todos: Todo[];
  hasCompletedTodos: boolean;
  selectedStatus: TodoStatusFilter;
  handleSelectedStatus: (status: TodoStatusFilter) => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  hasCompletedTodos,
  selectedStatus,
  handleSelectedStatus,
}) => {
  const countInCompleteTodos = todos.filter(todo => !todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {countInCompleteTodos} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(TodoStatusFilter).map((status, index) => (
          <FilterButton
            key={`${status}-${index}`}
            status={status}
            selectedStatus={selectedStatus}
            onSelectStatus={handleSelectedStatus}
          />
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
