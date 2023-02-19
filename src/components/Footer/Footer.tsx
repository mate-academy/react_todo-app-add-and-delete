import cn from 'classnames';
import React from 'react';
import { FilterState } from '../../types/FilterState';
import { Todo } from '../../types/Todo';

type Props = {
  filterState: FilterState,
  setFilterBy: (value: FilterState) => void,
  todos: Todo[]
  deleteTodosFromServer: (value: number) => void
};

export const Footer: React.FC<Props> = ({
  filterState,
  setFilterBy,
  todos,
  deleteTodosFromServer,
}) => {
  const completedTodos = todos.filter(todo => todo.completed);
  const todosLeft = todos.filter(todo => !todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${todosLeft.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={
            cn('filter__link',
              { selected: filterState === FilterState.All })
          }
          onClick={() => setFilterBy(FilterState.All)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={
            cn('filter__link',
              { selected: filterState === FilterState.Active })
          }
          onClick={() => setFilterBy(FilterState.Active)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={
            cn('filter__link',
              { selected: filterState === FilterState.Completed })
          }
          onClick={() => setFilterBy(FilterState.Completed)}
        >
          Completed
        </a>
      </nav>

      {todos.find(todo => todo.completed) && (
        <button
          data-cy="ClearCompletedButton"
          type="button"
          className="todoapp__clear-completed"
          onClick={() => {
            completedTodos.forEach(todo => deleteTodosFromServer(todo.id));
          }}
        >
          Clear completed
        </button>
      )}

    </footer>
  );
};
