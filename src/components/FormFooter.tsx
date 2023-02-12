import classNames from 'classnames';
import React from 'react';
import { Todo } from '../types/Todo';

enum Filters {
  Active = 'active',
  Completed = 'completed',
  All = 'all',
}

type Props = {
  todos: Todo[],
  filter: string,
  setFilter: (filter: Filters) => void;
  onClearCompleted: () => void,
};

export const FormFooter: React.FC<Props> = ({
  todos, filter, setFilter, onClearCompleted,
}) => {
  const completedTodos = todos.filter(todo => todo.completed);
  const unCompletedTodos = todos.filter(todo => !todo.completed);

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${unCompletedTodos.length} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames(
            'filter__link',
            { selected: filter === 'all' },
          )}
          onClick={() => {
            setFilter(Filters.All);
          }}
        >
          All
        </a>

        <a
          href="#/"
          className={classNames(
            'filter__link',
            { selected: filter === 'active' },
          )}
          onClick={() => {
            setFilter(Filters.Active);
          }}
        >
          Active
        </a>

        <a
          href="#/"
          className={classNames(
            'filter__link',
            { selected: filter === 'completed' },
          )}
          onClick={() => {
            setFilter(Filters.Completed);
          }}
        >
          Completed
        </a>
      </nav>

      {/* don't show this button if there are no completed todos */}

      <button
        type="button"
        className={classNames(
          'todoapp__clear-completed',
        )}
        onClick={() => onClearCompleted()}
        style={{
          visibility: completedTodos.length
            ? ('visible')
            : ('hidden'),
        }}
      >
        Clear completed
      </button>

    </footer>
  );
};
