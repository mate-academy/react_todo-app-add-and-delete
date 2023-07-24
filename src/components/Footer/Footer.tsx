import cn from 'classnames';
import { Filter } from '../../types/Filter';

type Props = {
  filterValue: Filter;
  activeTodosCount: number;
  complitedTodosCount: number;
  setFilterValue: (value: Filter) => void;
  onClear: () => void;
};

export const Footer: React.FC<Props> = ({
  activeTodosCount, complitedTodosCount, filterValue, setFilterValue, onClear,
}) => {
  const handleFilterChange = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const value = event.currentTarget.innerText as Filter;

    setFilterValue(value);
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodosCount} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: filterValue === Filter.ALL,
          })}
          onClick={(event) => handleFilterChange(event)}
        >
          {Filter.ALL}
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: filterValue === Filter.ACTIVE,
          })}
          onClick={(event) => handleFilterChange(event)}
        >
          {Filter.ACTIVE}
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: filterValue === Filter.COMPLETED,
          })}
          onClick={(event) => handleFilterChange(event)}
        >
          {Filter.COMPLETED}
        </a>
      </nav>

      {complitedTodosCount > 0 && (
        <button
          type="button"
          className="todoapp__clear-completed"
          disabled={complitedTodosCount === 0}
          onClick={onClear}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
