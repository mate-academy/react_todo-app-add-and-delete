import classNames from 'classnames';
import { FilterStatus } from '../types/FilterStatus';
import capitalize from '../utils/capitalize';

type Props = {
  setFilterStatus: (link: FilterStatus) => void;
  filterStatus: FilterStatus;
  todosActiveQuantity: number;
  todosComplitedQuantity: number;
  clearAllComplitedTodos: () => void;
};

const formatFilterStatusHref = (filterStatus: FilterStatus): string => {
  return `#/${filterStatus === FilterStatus.All ? '' : filterStatus}`;
};

export const Footer: React.FC<Props> = ({
  setFilterStatus,
  filterStatus,
  todosActiveQuantity,
  todosComplitedQuantity,
  clearAllComplitedTodos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todosActiveQuantity} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(FilterStatus).map(status => {
          return (
            <a
              href={formatFilterStatusHref(status)}
              className={classNames('filter__link', {
                selected: filterStatus === status,
              })}
              data-cy={`FilterLink${capitalize(status)}`}
              onClick={() => setFilterStatus(status)}
              key={status}
            >
              {capitalize(status)}
            </a>
          );
        })}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={todosComplitedQuantity === 0}
        onClick={clearAllComplitedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
