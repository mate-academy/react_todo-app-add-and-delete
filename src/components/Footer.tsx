import { useCallback, useContext } from 'react';
import { TodoContext } from '../contexts/TodoContext';
import classNames from 'classnames';
import { FilterType } from '../App';

export interface FooterType {
  filter: boolean | null;
  setFilter: React.Dispatch<React.SetStateAction<boolean | null>>;
  deleteAll: () => void;
}

export const Footer: React.FC<FooterType> = ({
  filter,
  setFilter,
  deleteAll,
}) => {
  const { todos } = useContext(TodoContext);

  const establishFilter = useCallback(
    (
      filterName: FilterType,
      e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    ) => {
      e.preventDefault();
      e.stopPropagation();

      switch (filterName) {
        case FilterType.ALL: {
          setFilter(null);
          break;
        }

        case FilterType.ACTIVE: {
          setFilter(false);
          break;
        }

        case FilterType.COMPLETED: {
          setFilter(true);
          break;
        }
      }
    },
    [setFilter],
  );

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todos.filter(x => !x.completed && x.id !== 0).length} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filter === null,
          })}
          data-cy="FilterLinkAll"
          onClick={e => establishFilter(FilterType.ALL, e)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filter === false,
          })}
          data-cy="FilterLinkActive"
          onClick={e => establishFilter(FilterType.ACTIVE, e)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filter === true,
          })}
          data-cy="FilterLinkCompleted"
          onClick={e => establishFilter(FilterType.COMPLETED, e)}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={() => deleteAll()}
        disabled={todos.find(x => x.completed) === undefined}
      >
        Clear completed
      </button>
    </footer>
  );
};
