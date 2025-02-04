import classNames from 'classnames';
import { Filter } from '../types/Filter';

type Props = {
  currentFilter: Filter;
  remainingTasks: number;
  hasCompletedTasks: boolean;
  setFilter: React.Dispatch<React.SetStateAction<Filter>>;
  clearCompletedTasks: () => void;
};

export const TodoFooter: React.FC<Props> = props => {
  const {
    currentFilter,
    remainingTasks: remainingTasks,
    hasCompletedTasks: hasCompletedTasks,
    setFilter,
    clearCompletedTasks,
  } = props;

  const handleFilterChange = (selectedFilter: Filter) => {
    setFilter(selectedFilter);
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {remainingTasks} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(Filter).map(filterOption => (
          <a
            href={`#/${filterOption}`}
            key={filterOption}
            className={classNames('filter__link', {
              selected: filterOption === currentFilter,
            })}
            data-cy={`FilterLink${filterOption}`}
            onClick={() => handleFilterChange(filterOption)}
          >
            {filterOption}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompletedTasks}
        onClick={clearCompletedTasks}
      >
        Clear completed
      </button>
    </footer>
  );
};
