import React from 'react';
import cn from 'classnames';

import { TodoCount } from '../TodoCount';

import { Todo } from '../../types/Todo';
import { FilterType } from '../../types/FilterType';

interface Props {
  todos: Todo[];
  filterBy: FilterType;
  onFilter: (filterType: FilterType) => void;
  onDeleteAllTodos: () => void;
}

export const Filters: React.FC<Props> = ({
  todos,
  filterBy,
  onFilter,
  onDeleteAllTodos,
}) => {
  const hasCompletedTodo = todos.some(todo => todo.completed);
  const todosLeft = todos.filter(todo => !todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <TodoCount todosLeft={todosLeft} />

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={cn('filter__link', {
            selected: filterBy === FilterType.ALL,
          })}
          onClick={() => {
            onFilter(FilterType.ALL);
          }}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={cn('filter__link', {
            selected: filterBy === FilterType.ACTIVE,
          })}
          onClick={() => {
            onFilter(FilterType.ACTIVE);
          }}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={cn('filter__link', {
            selected: filterBy === FilterType.COMPLETED,
          })}
          onClick={() => {
            onFilter(FilterType.COMPLETED);
          }}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        style={{ visibility: hasCompletedTodo ? 'visible' : 'hidden' }}
        onClick={onDeleteAllTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
