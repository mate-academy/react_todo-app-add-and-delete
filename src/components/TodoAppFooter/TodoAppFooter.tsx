import classNames from 'classnames';
import { FilterType } from '../../types/FilterType';

type Props = {
  filterType: FilterType;
  activeTodosCount: number;
  areCompletedTodos: boolean;
  onFilterChange: (newFilterType: FilterType) => void;
};

export const TodoAppFooter: React.FC<Props> = ({
  filterType,
  activeTodosCount,
  areCompletedTodos,
  onFilterChange,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodosCount} item${activeTodosCount === 1 ? '' : 's'} left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filterType === FilterType.All,
          })}
          onClick={() => onFilterChange(FilterType.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filterType === FilterType.Active,
          })}
          onClick={() => onFilterChange(FilterType.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filterType === FilterType.Completed,
          })}
          onClick={() => onFilterChange(FilterType.Completed)}
        >
          Completed
        </a>
      </nav>

      {areCompletedTodos && (
        <button type="button" className="todoapp__clear-completed">
          Clear completed
        </button>
      )}
    </footer>
  );
};
