import classNames from 'classnames';
import { FilterParams } from '../../types/FilterParams';

type Props = {
  isAnyCompleted: boolean;
  notCompletedCount: number;
  selectedFilter: FilterParams;
  onFilterChange: (filter: FilterParams) => void;
  onCompletedClear: () => void;
};

export const Footer = ({
  isAnyCompleted,
  notCompletedCount,
  selectedFilter,
  onFilterChange,
  onCompletedClear,
}: Props) => {
  const handleFilterChange = (
    event: React.MouseEvent<HTMLAnchorElement>,
    filter: FilterParams,
  ) => {
    event.preventDefault();

    onFilterChange(filter);
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${notCompletedCount} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(FilterParams).map(value => (
          <a
            key={value}
            href={value === FilterParams.ALL ? '#/' : `#/${value}`}
            className={classNames('filter__link', {
              selected: selectedFilter === value,
            })}
            data-cy={`FilterLink${value}`}
            onClick={event => handleFilterChange(event, value)}
          >
            {value}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!isAnyCompleted}
        onClick={onCompletedClear}
      >
        Clear completed
      </button>
    </footer>
  );
};
