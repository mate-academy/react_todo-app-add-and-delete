import cn from 'classnames';
import { Filter } from '../types/Filter';

type Props = {
  filter: Filter;
  onFilterChange?: (v: Filter) => void;
  quantityActiveTodos: number;
  isAnyTodoComplete: boolean;
};

export const TodoFooter: React.FC<Props> = ({
  filter,
  onFilterChange = () => { },
  quantityActiveTodos,
  isAnyTodoComplete,
}) => {
  const handleFilterChange = (v: Filter) => () => onFilterChange(v);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${quantityActiveTodos} item${quantityActiveTodos <= 1 ? '' : 's'} left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: filter === Filter.ALL,
          })}
          data-cy="FilterLinkAll"
          onClick={handleFilterChange(Filter.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: filter === Filter.ACTIVE,
          })}
          data-cy="FilterLinkActive"
          onClick={handleFilterChange(Filter.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: filter === Filter.COMPLETED,
          })}
          data-cy="FilterLinkCompleted"
          onClick={handleFilterChange(Filter.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      {/* don't show this button if there are no completed todos */}
      {isAnyTodoComplete && (
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
