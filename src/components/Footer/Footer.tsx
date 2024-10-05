import React from 'react';
import { Todo } from '../../types/Todo';
import { FilterStatus } from '../../types/filterStatus';

type Props = {
  todos: Todo[];
  todosCount: number;
  clearCompleted: () => void;
  filter: string;
  setFilter: (filter: string) => void;
};

export const Footer: React.FC<Props> = ({
  todosCount,
  clearCompleted,
  filter,
  setFilter,
  todos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todosCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={`filter__link ${filter === FilterStatus.All ? 'selected' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </a>
        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={`filter__link ${filter === FilterStatus.Active ? 'selected' : ''}`}
          onClick={() => setFilter('active')}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={`filter__link ${filter === FilterStatus.Completed ? 'selected' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={clearCompleted}
        disabled={todos.every(todo => !todo.completed)}
      >
        Clear completed
      </button>
    </footer>
  );
};
