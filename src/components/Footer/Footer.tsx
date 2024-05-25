import cn from 'classnames';
import { Statuses } from '../../types/Statuses';

interface Props {
  status: Statuses;
  setStatus: React.Dispatch<React.SetStateAction<Statuses>>;
  isAnyTodosCompleted: boolean;
  notCompletedTodosCount: number;
  onDeleteCompleted: () => void;
}

export const Footer: React.FC<Props> = ({
  status,
  setStatus,
  isAnyTodosCompleted,
  notCompletedTodosCount,
  onDeleteCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${notCompletedTodosCount} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: status === 'all',
          })}
          data-cy="FilterLinkAll"
          onClick={() => setStatus(Statuses.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: status === 'active',
          })}
          data-cy="FilterLinkActive"
          onClick={() => setStatus(Statuses.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: status === 'completed',
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setStatus(Statuses.Completed)}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!isAnyTodosCompleted}
        onClick={onDeleteCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
