import cn from 'classnames';
import { filterOptions } from '../../constants/filterOptions';
import { FilterOptions } from '../../types/FilterOptions';

type Props = {
  incompleteTodosCount: number;
  onSelectFilter: React.Dispatch<React.SetStateAction<FilterOptions>>;
  selectedFilter: FilterOptions;
};

export const Footer: React.FC<Props> = ({
  incompleteTodosCount,
  onSelectFilter,
  selectedFilter,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {incompleteTodosCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {filterOptions.map(option => (
          <a
            key={option}
            onClick={() => onSelectFilter(option)}
            href={`#/${option === 'All' ? '' : option}`}
            className={cn(
              'filter__link',
              selectedFilter === option && 'selected',
            )}
            data-cy={`FilterLink${option}`}
          >
            {option}
          </a>
        ))}
      </nav>

      <button
        disabled={!incompleteTodosCount}
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
      >
        Clear completed
      </button>
    </footer>
  );
};
