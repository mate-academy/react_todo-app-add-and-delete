import classNames from 'classnames';
import { FilterBy } from '../../types/FilterBy';

type Props = {
  filterBy: FilterBy;
  setFilterBy: (status: FilterBy) => void;
  todosLength: number | undefined;
  todosCompleted: number | undefined;
  onDeleteCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  filterBy,
  setFilterBy,
  todosLength = 0,
  todosCompleted = 0,
  onDeleteCompleted,
}) => {
  const todoLeft = todosLength - todosCompleted;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        { `${todoLeft} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames(
            'filter__link',
            {
              selected: filterBy === FilterBy.All,
            },
          )}
          onClick={() => setFilterBy(FilterBy.All)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames(
            'filter__link',
            {
              selected: filterBy === FilterBy.Active,
            },
          )}
          onClick={() => setFilterBy(FilterBy.Active)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames(
            'filter__link',
            {
              selected: filterBy === FilterBy.Completed,
            },
          )}
          onClick={() => setFilterBy(FilterBy.Completed)}
        >
          Completed
        </a>
      </nav>

      {todosCompleted > 0 && (
        <button
          data-cy="ClearCompletedButton"
          type="button"
          className="todoapp__clear-completed"
          onClick={() => {
            onDeleteCompleted();
          }}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
