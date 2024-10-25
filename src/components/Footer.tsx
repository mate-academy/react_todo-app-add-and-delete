import classNames from 'classnames';
import { Filter } from '../Filter';

type Props = {
  activeTodosCount: number;
  currFilter: Filter;
  hasCompletedTodos: boolean;
  onFilterClick: (newFilter: Filter) => void;
  onClearCompletedTodos: () => void;
};

export const Footer: React.FC<Props> = ({
  activeTodosCount,
  currFilter,
  hasCompletedTodos,
  onFilterClick,
  onClearCompletedTodos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodosCount} items left`}
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {Object.values(Filter).map(filter => {
          const capitalizedFilter =
            filter[0].toUpperCase() + filter.slice(1).toLowerCase();

          return (
            <a
              key={filter}
              href={`#/${filter === Filter.All ? '' : filter}`}
              className={classNames('filter__link', {
                selected: currFilter === filter,
              })}
              data-cy={`FilterLink${capitalizedFilter}`}
              onClick={() => onFilterClick(filter)}
            >
              {capitalizedFilter}
            </a>
          );
        })}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onClearCompletedTodos}
        disabled={!hasCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
