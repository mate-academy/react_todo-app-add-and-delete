import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { GroupBy } from '../../types/GroupBy';
import { Todo } from '../../types/Todo';

type Props = {
  filterTodos: (groupBy: string) => void;
  completedTodosLength: number;
  leftTodosLength: number;
  todos: Todo[];
  removeCompletedTodos: () => void;
};

export const FilterTodos: React.FC<Props> = ({
  filterTodos,
  todos,
  completedTodosLength,
  leftTodosLength,
  removeCompletedTodos,
}) => {
  const [groupBy, setGroupBy] = useState('All');

  useEffect(() => {
    filterTodos(groupBy);
  }, [groupBy, todos]);

  const handleChange = (event: React.SyntheticEvent<HTMLAnchorElement>) => {
    setGroupBy(event.currentTarget.textContent || GroupBy.All);
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${leftTodosLength} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames(
            'filter__link',
            { selected: groupBy === GroupBy.All },
          )}
          onClick={handleChange}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: groupBy === GroupBy.Active },
          )}
          onClick={handleChange}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: groupBy === GroupBy.Completed },
          )}
          onClick={handleChange}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className={classNames(
          'todoapp__clear-completed',
          { 'is-invisible': !completedTodosLength },
        )}
        onClick={removeCompletedTodos}
      >
        Clear completed
      </button>

    </footer>
  );
};
