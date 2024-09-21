import React from 'react';
import { Todo } from '../types/Todo';
import { Filter } from '../types/Filter';

interface FooterProps {
  counterOfActiveTodos: number;
  filter: string;
  todos: Todo[];
  handleFilterChange: (filter: Filter) => void;
  handleDeleteAllCompleted: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  counterOfActiveTodos,
  filter,
  todos,
  handleFilterChange,
  handleDeleteAllCompleted,
}) => {
  const renderFilterLink = (filterValue: Filter, label: string) => (
    <a
      href={`#/${filterValue.toLowerCase()}`}
      className={`filter__link ${filter === filterValue ? 'selected' : ''}`}
      onClick={() => handleFilterChange(filterValue)}
      data-cy={`FilterLink${label}`}
    >
      {label}
    </a>
  );

  const hasCompletedTodos = todos.some(todo => todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${counterOfActiveTodos} items left`}
      </span>
      <nav className="filter" data-cy="Filter">
        {renderFilterLink(Filter.ALL, 'All')}
        {renderFilterLink(Filter.ACTIVE, 'Active')}
        {renderFilterLink(Filter.COMPLETED, 'Completed')}
      </nav>
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompletedTodos}
        onClick={handleDeleteAllCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
