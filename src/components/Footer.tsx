import classNames from 'classnames';
import { Filter } from '../utils/enums';

type Props = {
  filterStatus: Filter;
  onFilterChange(status: Filter): void;
  numberOfTodos: number | undefined;
  isCompletedTodos: boolean;
  onRemove(todoId: number[]): void;
  allCompletedTodosId: number[];
};

export const Footer: React.FC<Props> = ({
  filterStatus,
  onFilterChange,
  numberOfTodos,
  isCompletedTodos,
  onRemove,
  allCompletedTodosId,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${numberOfTodos} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames(
            'filter__link',
            {
              selected: filterStatus === Filter.All,
            },
          )}
          onClick={() => onFilterChange(Filter.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link',
            {
              selected: filterStatus === Filter.Active,
            },
          )}
          onClick={() => onFilterChange(Filter.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link',
            {
              selected: filterStatus === Filter.Completed,
            },
          )}
          onClick={() => onFilterChange(Filter.Completed)}
        >
          Completed
        </a>
      </nav>

      {isCompletedTodos && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={() => {
            onRemove(allCompletedTodosId);
          }}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
