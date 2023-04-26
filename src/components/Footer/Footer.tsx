import classNames from 'classnames';
import { useMemo } from 'react';
import { Status } from '../../types/Status';
import { Todo } from '../../types/Todo';

type Props = {
  filterType: Status,
  setFilterType: (value: Status) => void,
  todos: Todo[],
  onClearCompleted: () => void,
};

export const Footer: React.FC<Props> = ({
  filterType,
  setFilterType,
  todos,
  onClearCompleted,
}) => {
  const hasCompleted = useMemo(() => {
    return todos.some(todo => todo.completed);
  }, [todos]);

  const activeTodos = useMemo(() => {
    return todos.filter(todo => !todo.completed);
  }, [todos]);

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodos.length} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames('filter__link',
            { selected: filterType === Status.All })}
          onClick={() => setFilterType(Status.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link',
            { selected: filterType === Status.Active })}
          onClick={() => setFilterType(Status.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link',
            { selected: filterType === Status.Completed })}
          onClick={() => setFilterType(Status.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className={classNames('todoapp__clear-completed', {
          'todoapp__clear-completed--unvisible': !hasCompleted,
        })}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
