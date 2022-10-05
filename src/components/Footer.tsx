import classNames from 'classnames';
import { useMemo } from 'react';
import { FilterType } from '../types/FilterType';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  filterBy: string;
  setFilterBy: (value: FilterType) => void;
  deleteCompletedTodos: () => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  filterBy,
  setFilterBy,
  deleteCompletedTodos,
}) => {
  const activeTodos = useMemo(() => (
    todos.filter(todo => !todo.completed)
  ), [todos]);

  const completedTodos = useMemo(() => (
    todos.filter(todo => todo.completed)
  ), [todos]);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${activeTodos.length} items is left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames(
            'filter__link', { selected: filterBy === FilterType.ALL },
          )}
          onClick={() => setFilterBy(FilterType.ALL)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames(
            'filter__link', { selected: filterBy === FilterType.ACTIVE },
          )}
          onClick={() => setFilterBy(FilterType.ACTIVE)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames(
            'filter__link', { selected: filterBy === FilterType.COMPLETED },
          )}
          onClick={() => setFilterBy(FilterType.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={deleteCompletedTodos}
      >
        {completedTodos.length > 0 && 'Clear completed'}
      </button>
    </footer>
  );
};
