import React from 'react';
import { FilterButton } from '../FilterButton';
import { Todo, TodoStatusFilter } from '../../types/Todo';

interface Props {
  todos: Todo[];
  hasCompletedTodos: boolean;
  selectedStatus: TodoStatusFilter;
  handleSelectStatus: (status: TodoStatusFilter) => void;
  onDeleteCompletedTodos: (completeTodos: Todo[]) => void;
}

export const Footer: React.FC<Props> = ({
  todos,
  hasCompletedTodos,
  selectedStatus,
  handleSelectStatus,
  onDeleteCompletedTodos,
}) => {
  const completeTodos = todos.filter(todo => todo.completed);
  const incompleteTodosCount = todos.filter(todo => !todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {incompleteTodosCount} items left
      </span>
      <nav className="filter" data-cy="Filter">
        {Object.values(TodoStatusFilter).map((status, index) => (
          <FilterButton
            key={`${status}-${index}`}
            status={status}
            selectedStatus={selectedStatus}
            onSelectStatus={handleSelectStatus}
          />
        ))}
      </nav>
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompletedTodos}
        onClick={() => onDeleteCompletedTodos(completeTodos)}
      >
        Clear completed
      </button>
    </footer>
  );
};
