import React, { useMemo } from 'react';
import classNames from 'classnames';

import { Filter } from '../types/Filter';
import { Todo } from '../types/Todo';

type Props = {
  visibleTodos: Todo[],
  filter: Filter,
  onChange: (selector: Filter) => void,
  onClearCompleted: () => void,
};

export const Footer: React.FC<Props> = ({
  visibleTodos,
  filter,
  onChange,
  onClearCompleted,
}) => {
  const onAllClick = () => {
    onChange(Filter.all);
  };

  const onActiveClick = () => {
    onChange(Filter.active);
  };

  const onCompletedClick = () => {
    onChange(Filter.completed);
  };

  const isSomeCompleted = useMemo(
    () => visibleTodos.some(todo => todo.completed),
    [visibleTodos],
  );

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${visibleTodos.length} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter">
        <a
          href="#/"
          className={classNames(
            'filter__link',
            { selected: filter === Filter.all },
          )}
          onClick={onAllClick}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: filter === Filter.active },
          )}
          onClick={onActiveClick}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: filter === Filter.completed },
          )}
          onClick={onCompletedClick}
        >
          Completed
        </a>
      </nav>

      {isSomeCompleted && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={onClearCompleted}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
