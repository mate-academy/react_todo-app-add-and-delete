import classNames from 'classnames';
import { useMemo } from 'react';
import { FilterType } from '../../types/Filter';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  filterType: string;
  handleFilter: (arg: FilterType) => void;
  deleteTodoCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  filterType,
  handleFilter,
  deleteTodoCompleted,

}) => {
  const activeTodos = useMemo(() => (
    todos.filter(({ completed }) => !completed).length
  ), [todos]);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${activeTodos} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames(
            'filter__link',
            { selected: filterType === FilterType.All },
          )}
          onClick={() => handleFilter(FilterType.All)}
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
          onClick={() => handleFilter(FilterType.Active)}
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
          onClick={() => handleFilter(FilterType.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={deleteTodoCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
