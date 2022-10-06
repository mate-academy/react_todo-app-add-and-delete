import React from 'react';
import classnames from 'classnames';
import { Todo } from '../../types/Todo';
import { FilterType } from '../../types/FilterType';

type Props = {
  todos: Todo[],
  filteredTodos: Todo[],
  filterType: string,
  onFilterChange: CallableFunction,
  handleDeleteTodos: CallableFunction,
};

export const Footer: React.FC<Props> = ({
  todos,
  filterType,
  filteredTodos,
  onFilterChange,
  handleDeleteTodos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${filteredTodos.filter(todo => !todo.completed).length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={
            classnames(
              'filter__link',
              { selected: filterType === FilterType.All },
            )
          }
          onClick={() => onFilterChange(FilterType.All)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={
            classnames(
              'filter__link',
              { selected: filterType === FilterType.Active },
            )
          }
          onClick={() => onFilterChange(FilterType.Active)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={
            classnames(
              'filter__link',
              { selected: filterType === FilterType.Completed },
            )
          }
          onClick={() => onFilterChange(FilterType.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={() => {
          filteredTodos
            .filter(todo => todo.completed)
            .forEach(todo => handleDeleteTodos(todo.id));
        }}
      >
        {todos.some(todo => todo.completed) && 'Clear completed'}
      </button>
    </footer>
  );
};
