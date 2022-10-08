import classNames from 'classnames';
import { useMemo } from 'react';
import { FilterType } from '../types/FilterType';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[],
  setFilter: (args: FilterType) => void,
  filterStatus: FilterType,
  clearCompleted: () => void,
};

export const Footer: React.FC<Props> = ({
  todos,
  setFilter,
  filterStatus,
  clearCompleted,
}) => {
  const notCompleted = useMemo(() => (
    todos.filter(({ completed }) => !completed)
  ), [todos]);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${notCompleted.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames(
            'filter__link',
            { selected: filterStatus },
          )}
          onClick={() => {
            setFilter(FilterType.All);
          }}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: filterStatus },
          )}
          onClick={() => {
            setFilter(FilterType.Active);
          }}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: filterStatus },
          )}
          onClick={() => {
            setFilter(FilterType.Completed);
          }}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={clearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
