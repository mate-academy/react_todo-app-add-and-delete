import classNames from 'classnames';
import { useMemo } from 'react';

import { Todo } from '../types/Todo';
import { FilterStatus } from '../types/FilterStatus';

type Props = {
  todos: Todo[];
  filterStatus: FilterStatus;
  onSetFilterStatus: (status: FilterStatus) => void;
  onClearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  filterStatus,
  onSetFilterStatus,
  onClearCompleted,
}) => {
  const activeTodosCount = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  const noCompletedTodos = useMemo(() => {
    return todos.every(todo => !todo.completed);
  }, [todos]);

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodosCount} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames(
            'filter__link',
            { selected: filterStatus === 'all' },
          )}
          onClick={() => onSetFilterStatus(FilterStatus.all)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: filterStatus === 'active' },
          )}
          onClick={() => onSetFilterStatus(FilterStatus.active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: filterStatus === 'completed' },
          )}
          onClick={() => onSetFilterStatus(FilterStatus.completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        disabled={noCompletedTodos}
        onClick={() => onClearCompleted()}
      >
        Clear completed
      </button>
    </footer>
  );
};
