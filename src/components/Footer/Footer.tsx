import React, { useContext, useMemo } from 'react';
import classNames from 'classnames';

import { TodosContext } from '../../contexts/TodosContext';
import { TodosFilterQuery } from '../../constants';

export const Footer: React.FC = () => {
  const { todos, query, setQuery } = useContext(TodosContext);

  const activeTodosAmount = useMemo(() => {
    return todos.reduce((counter, todo) => (
      !todo.completed ? counter + 1 : 0
    ), 0);
  }, [todos]);

  const completedTodosAmount = todos.length - activeTodosAmount;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosAmount}
        {' '}
        items left
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames(
            'filter__link',
            { selected: query === TodosFilterQuery.all },
          )}
          data-cy="FilterLinkAll"
          onClick={() => setQuery(TodosFilterQuery.all)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: query === TodosFilterQuery.active },
          )}
          data-cy="FilterLinkActive"
          onClick={() => setQuery(TodosFilterQuery.active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: query === TodosFilterQuery.completed },
          )}
          data-cy="FilterLinkCompleted"
          onClick={() => setQuery(TodosFilterQuery.completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        style={{ visibility: completedTodosAmount > 0 ? 'visible' : 'hidden' }}
      >
        Clear completed
      </button>
    </footer>
  );
};
