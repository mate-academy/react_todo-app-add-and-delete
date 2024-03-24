import cn from 'classnames';
import { Filter } from '../../types/Filter';

type Props = {
  itemsLeft: number;
  currentFilter: Filter;
  setFilter: (f: Filter) => void;
  itemsCompleted: number;
  deleteCompletedTodosHandler: () => void;
};

export const Footer: React.FC<Props> = ({
  itemsLeft,
  currentFilter,
  setFilter,
  itemsCompleted,
  deleteCompletedTodosHandler,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${itemsLeft} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: currentFilter === Filter.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setFilter(Filter.All)}
        >
          {Filter.All}
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: currentFilter === Filter.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setFilter(Filter.Active)}
        >
          {Filter.Active}
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: currentFilter === Filter.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilter(Filter.Completed)}
        >
          {Filter.Completed}
        </a>
      </nav>

      {itemsCompleted > 0 && (
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          onClick={deleteCompletedTodosHandler}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
