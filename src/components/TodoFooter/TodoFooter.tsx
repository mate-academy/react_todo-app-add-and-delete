import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { Status } from '../../Enums/Enums';

type Props = {
  todos: Todo[],
  filterBy: Status,
  setFilterBy: (p: Status) => void,
  onDeleteCompleted: () => void;
};

export const TodoFooter: React.FC<Props> = (
  {
    todos, filterBy, setFilterBy, onDeleteCompleted,
  },
) => {
  const visibleTodos = todos.filter(todo => {
    return !todo.completed;
  });

  const completedTodos = todos.length - visibleTodos.length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${visibleTodos.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames('filter__link', {
            selected: filterBy === 'all',
          })}
          onClick={() => {
            setFilterBy(Status.ALL);
          }}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames('filter__link', {
            selected: filterBy === 'active',
          })}
          onClick={() => {
            setFilterBy(Status.ACTIVE);
          }}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames('filter__link', {
            selected: filterBy === Status.COMPLETED,
          })}
          onClick={() => {
            setFilterBy(Status.COMPLETED);
          }}
        >
          Completed
        </a>
      </nav>

      {
        completedTodos > 0 && (
          <button
            data-cy="ClearCompletedButton"
            type="button"
            className="todoapp__clear-completed"
            onClick={() => onDeleteCompleted()}
          >
            Clear completed
          </button>
        )
      }
    </footer>
  );
};
