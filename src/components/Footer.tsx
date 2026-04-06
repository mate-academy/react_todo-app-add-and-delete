import { Status } from '../types/Status';
import classNames from 'classnames';

type Props = {
  activeCount: number;
  complitedCount: number;
  status: Status;
  setStatus: (value: Status) => void;
  deleteCompletedTodos: () => void;
};

export const Footer: React.FC<Props> = ({
  activeCount,
  complitedCount,
  status,
  setStatus,
  deleteCompletedTodos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeCount} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {Object.values(Status).map(value => (
          <a
            key={value}
            href={
              value === Status.All
                ? '#/'
                : value === Status.Active
                  ? '#/active'
                  : '#/completed'
            }
            data-cy={
              value === Status.All
                ? 'FilterLinkAll'
                : value === Status.Active
                  ? 'FilterLinkActive'
                  : 'FilterLinkCompleted'
            }
            className={classNames([
              'filter__link',
              {
                selected: status === value,
              },
            ])}
            onClick={event => {
              event.preventDefault();

              setStatus(value);
            }}
          >
            {value}
          </a>
        ))}
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={complitedCount === 0}
        onClick={deleteCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
