import React from 'react';
import { Todo } from './types/Todo';
import { FilterEnum } from './types/filterEnum';

interface Props {
  todos: Todo[];
  filter: FilterEnum;
  setFilter: (filter: FilterEnum) => void;
  clearCompleted: () => void;
  loadingTodo: number | null;
}

export const Footer: React.FC<Props> = ({
  todos,
  filter,
  setFilter,
  clearCompleted,
  loadingTodo,
}) => {
  const activeTodosCount = todos.filter(
    todo => !todo.completed && todo.id !== loadingTodo,
  ).length;
  const completedTodosCount = todos.filter(todo => todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={`filter__link ${filter === FilterEnum.All ? 'selected' : ''}`}
          onClick={() => setFilter(FilterEnum.All)}
          data-cy="FilterLinkAll"
        >
          All
        </a>

        <a
          href="#/active"
          className={`filter__link ${filter === FilterEnum.Active ? 'selected' : ''}`}
          onClick={() => setFilter(FilterEnum.Active)}
          data-cy="FilterLinkActive"
        >
          Active
        </a>

        <a
          href="#/completed"
          className={`filter__link ${filter === FilterEnum.Completed ? 'selected' : ''}`}
          onClick={() => setFilter(FilterEnum.Completed)}
          data-cy="FilterLinkCompleted"
        >
          Completed
        </a>
      </nav>
      <button
        className="todoapp__clear-completed"
        onClick={clearCompleted}
        data-cy="ClearCompletedButton"
        disabled={completedTodosCount === 0}
      >
        Clear Completed
      </button>
    </footer>
  );
};
