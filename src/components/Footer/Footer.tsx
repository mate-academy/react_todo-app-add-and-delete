import classNames from 'classnames';
import { useMemo } from 'react';
import { FilterType } from '../../types/FilterType';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  filterType: FilterType;
  setFilterType: (filter: FilterType) => void;
  onDelete: () => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  filterType,
  setFilterType,
  onDelete,
}) => {
  const todosRemoved = useMemo(() => (
    todos.filter(({ completed }) => !completed)
  ), [todos]);

  const todosCompleted = useMemo(() => (
    todos.filter(todo => todo.completed).length),
  [todos]);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${todosRemoved.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames(
            'filter__link',
            { selected: filterType },
          )}
          onClick={() => setFilterType(FilterType.All)}
        >
          All
        </a>
        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: filterType === FilterType.Active },
          )}
          onClick={() => setFilterType(FilterType.Active)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: filterType === FilterType.Completed },
          )}
          onClick={() => setFilterType(FilterType.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={onDelete}
        disabled={!todosCompleted}
      >
        {!todosCompleted && 'Clear completed'}
      </button>
    </footer>
  );
};
