import React, { FC, useCallback } from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';
import { TodoStatus } from '../../types/TodoStatus';

interface Props {
  todos: Todo[];
  filterQuery: TodoStatus;
  onChangeFilterQuery: (newStatus: TodoStatus) => void;
  onClear: () => void;
}

export const Footer: FC<Props> = React.memo(function Footer({
  todos,
  filterQuery,
  onChangeFilterQuery,
  onClear,
}) {
  const handleChangeFilter = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>, value: TodoStatus) => {
      event.preventDefault();

      onChangeFilterQuery(value);
    },
    [onChangeFilterQuery],
  );

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todos.filter(todo => !todo.completed).length} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filterQuery === 'All',
          })}
          data-cy="FilterLinkAll"
          onClick={e => handleChangeFilter(e, 'All')}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filterQuery === 'Active',
          })}
          data-cy="FilterLinkActive"
          onClick={e => handleChangeFilter(e, 'Active')}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filterQuery === 'Completed',
          })}
          data-cy="FilterLinkCompleted"
          onClick={e => handleChangeFilter(e, 'Completed')}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!todos.some(todo => todo.completed)}
        onClick={onClear}
      >
        Clear completed
      </button>
    </footer>
  );
});
