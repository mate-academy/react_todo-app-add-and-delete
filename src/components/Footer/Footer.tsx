import classNames from 'classnames';
import { FilterStatus } from '../../components/enums/enums';
type Props = {
  todosCompleted: number;
  todosActive: number;
  statusValue: FilterStatus;
  handleStatusValueChange: (statusValue: FilterStatus) => void;
  handleClearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  todosCompleted,
  todosActive,
  statusValue,
  handleStatusValueChange,
  handleClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todosActive} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(FilterStatus).map(status => (
          <a
            key={status}
            href={
              status === FilterStatus.All ? `#/` : `#/${status.toLowerCase()}`
            }
            className={classNames('filter__link', {
              selected: statusValue === status,
            })}
            data-cy={`FilterLink${status}`}
            onClick={() => handleStatusValueChange(status)}
          >
            {status}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!todosCompleted}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
