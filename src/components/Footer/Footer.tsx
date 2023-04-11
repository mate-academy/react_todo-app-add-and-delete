import classNames from 'classnames';
import { FilterType } from '../../types/FilterEnum';

type Props = {
  activeTodos: number;
  completedTodos: number
  selectedFilter: FilterType
  onSelectFilter: (filterType: FilterType) => void
};

export const Footer: React.FC<Props> = ({
  onSelectFilter,
  completedTodos,
  selectedFilter,
  activeTodos,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodos} items left`}
      </span>

      <nav className="filter">
        {Object.values(FilterType).map(filterType => (
          <a
            href="#/"
            className={classNames(
              'filter__link',
              { selected: filterType === selectedFilter },
            )}
            onClick={() => onSelectFilter(filterType)}
          >
            {filterType}
          </a>
        ))}
      </nav>

      {completedTodos > 0 && (
        <button
          type="button"
          className="todoapp__clear-completed"
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
