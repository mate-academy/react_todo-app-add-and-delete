import classNames from 'classnames';
import { TodoStatusFilter } from './types/TodoStatusFilter';

type Props = {
  statusFilter: TodoStatusFilter;
  onChange: (filter: TodoStatusFilter) => void;
};

export const Filter: React.FC<Props> = ({ statusFilter, onChange }) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={classNames('filter__link', {
          selected: statusFilter === TodoStatusFilter.All,
        })}
        data-cy="FilterLinkAll"
        onClick={() => onChange(TodoStatusFilter.All)}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: statusFilter === TodoStatusFilter.Active,
        })}
        data-cy="FilterLinkActive"
        onClick={() => onChange(TodoStatusFilter.Active)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: statusFilter === TodoStatusFilter.Completed,
        })}
        data-cy="FilterLinkCompleted"
        onClick={() => onChange(TodoStatusFilter.Completed)}
      >
        Completed
      </a>
    </nav>
  );
};
