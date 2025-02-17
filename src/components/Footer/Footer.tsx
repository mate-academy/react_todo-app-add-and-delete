import React from 'react';
import { Todo } from '../../types/Todo';
import { FilterStatus } from '../../types/FilterStatus';
import cn from 'classnames';

type Props = {
  todos: Todo[];
  filterStatus: FilterStatus;
  onChangeStatus: (status: FilterStatus) => void;
  onDelete: (todoId: number) => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  filterStatus,
  onChangeStatus,
  onDelete,
}) => {
  const leftTodos = todos.filter(todo => !todo.completed).length;
  const completedTodos = todos.some(todo => todo.completed);

  function handleDeleteAllCompleted() {
    const allCompletedTodos = todos.filter(todo => todo.completed);

    allCompletedTodos.map(todo => onDelete(todo.id));
  }

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {leftTodos} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: filterStatus === FilterStatus.all,
          })}
          data-cy="FilterLinkAll"
          onClick={() => onChangeStatus(FilterStatus.all)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: filterStatus === FilterStatus.active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => onChangeStatus(FilterStatus.active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: filterStatus === FilterStatus.completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => onChangeStatus(FilterStatus.completed)}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleDeleteAllCompleted}
        disabled={!completedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
