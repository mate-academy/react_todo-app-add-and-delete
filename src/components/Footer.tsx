import classNames from 'classnames';
import { FilterTypes } from '../types/Filter';
import { Todo } from '../types/Todo';

type Props = {
  filterBy: string,
  setFilterBy: (str: FilterTypes) => void,
  activeTodos: Todo[] | [],
  completedTodos: Todo[] | [],
  removeCompletedTodos: () => void,
};

export const Footer: React.FC<Props> = ({
  activeTodos,
  filterBy,
  setFilterBy,
  completedTodos,
  removeCompletedTodos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${activeTodos.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames('filter__link',
            {
              selected: filterBy === FilterTypes.All,
            })}
          onClick={() => (
            setFilterBy(FilterTypes.All)
          )}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames('filter__link',
            {
              selected: filterBy === FilterTypes.Active,
            })}
          onClick={() => (
            setFilterBy(FilterTypes.Active)
          )}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames('filter__link',
            {
              selected: filterBy === FilterTypes.Completed,
            })}
          onClick={() => (
            setFilterBy(FilterTypes.Completed)
          )}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        disabled={!completedTodos.length}
        onClick={removeCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
