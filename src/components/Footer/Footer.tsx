import React from 'react';
import cn from 'classnames';

import { Todo, FilterType } from '../../types';

interface Props {
  todos: Todo[];
  filterType: FilterType;
  onChangeType: (type: FilterType) => void;
  onDelete: (todoId: number) => void;
}

export const Footer: React.FC<Props> = ({
  todos,
  filterType,
  onChangeType,
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

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: filterType === FilterType.ALL,
          })}
          data-cy="FilterLinkAll"
          onClick={() => onChangeType(FilterType.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: filterType === FilterType.ACTIVE,
          })}
          data-cy="FilterLinkActive"
          onClick={() => onChangeType(FilterType.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: filterType === FilterType.COMPLETED,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => onChangeType(FilterType.COMPLETED)}
        >
          Completed
        </a>
      </nav>

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
