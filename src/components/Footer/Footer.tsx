import cn from 'classnames';
import { FilterState } from '../../types/FilterState';
import React from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  activeTodosCount: number;
  completedTodosCount: number;
  activeFilter: FilterState;
  setActiveFilter: (state: FilterState) => void;
  handleDeleteTodo: (todoId: number) => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  activeTodosCount,
  completedTodosCount,
  activeFilter,
  setActiveFilter,
  handleDeleteTodo,
}) => {
  const handleCompletedTodosDelete = () => {
    todos
      .filter(todo => todo.completed)
      .forEach(todo => {
        handleDeleteTodo(todo.id);
      });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: activeFilter === FilterState.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setActiveFilter(FilterState.All)}
        >
          {FilterState.All}
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: activeFilter === FilterState.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setActiveFilter(FilterState.Active)}
        >
          {FilterState.Active}
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: activeFilter === FilterState.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setActiveFilter(FilterState.Completed)}
        >
          {FilterState.Completed}
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedTodosCount === 0}
        onClick={handleCompletedTodosDelete}
      >
        Clear completed
      </button>
    </footer>
  );
};
