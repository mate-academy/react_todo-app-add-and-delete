import React, { useMemo } from 'react';
import classNames from 'classnames';
import { FilterStatus, Todo } from '../types/Todo';

type Props = {
  selected: FilterStatus;
  filter: (status: FilterStatus) => void;
  clearCompleted: () => void;
  todos: Todo[];
};

export const TodoFilter: React.FC<Props> = ({
  selected,
  filter,
  clearCompleted,
  todos,
}) => {
  const completedTodos = useMemo(() => {
    return todos.filter(todo => todo.completed);
  }, [todos]);

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${todos.length - completedTodos.length} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames('filter__link',
            { selected: selected === FilterStatus.All })}
          onClick={() => filter(FilterStatus.All)}
        >
          All
        </a>

        <a
          href="#/"
          className={classNames('filter__link',
            { selected: selected === FilterStatus.Active })}
          onClick={() => filter(FilterStatus.Active)}
        >
          Active
        </a>

        <a
          href="#/"
          className={classNames('filter__link',
            { selected: selected === FilterStatus.Completed })}
          onClick={() => filter(FilterStatus.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        style={{
          visibility: todos.every(todo => !todo.completed)
            ? 'hidden'
            : 'visible',
        }}
        onClick={() => clearCompleted()}
      >
        Clear completed
      </button>
    </footer>
  );
};
