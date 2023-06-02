import React from 'react';
import classNames from 'classnames';

import { Filters } from '../../types/Filters';

type Props = {
  selectTodo: (selectTodo: string) => void;
  selected: string;
  todoCount: number;
  onRemoveCompleted: () => void;
  isClearCopleted: boolean;
};

export const Footer: React.FC<Props> = React.memo(({
  selectTodo,
  selected,
  todoCount,
  onRemoveCompleted,
  isClearCopleted,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${todoCount} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames('filter__link',
            { selected: selected === Filters.All })}
          onClick={() => selectTodo(Filters.All)}
        >
          {Filters.All}
        </a>

        <a
          href="#/active"
          className={classNames('filter__link',
            { selected: selected === Filters.Active })}
          onClick={() => selectTodo(Filters.Active)}
        >
          {Filters.Active}
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link',
            { selected: selected === Filters.Completed })}
          onClick={() => selectTodo(Filters.Completed)}
        >
          {Filters.Completed}
        </a>
      </nav>

      <button
        type="button"
        className={classNames('todoapp__clear-completed',
          { hidden: isClearCopleted })}
        onClick={() => onRemoveCompleted()}
        hidden={!isClearCopleted}
      >
        Clear completed
      </button>
    </footer>
  );
});
