import cn from 'classnames';

export enum TodoStatus {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

type StatusFilterProps = {
  value: TodoStatus;
  onValueChange: (value: TodoStatus) => void;
};

export function StatusFilter({ value, onValueChange }: StatusFilterProps) {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={cn('filter__link', {
          selected: value === TodoStatus.All,
        })}
        data-cy="FilterLinkAll"
        onClick={() => onValueChange(TodoStatus.All)}
      >
        All
      </a>

      <a
        href="#/active"
        className={cn('filter__link', {
          selected: value === TodoStatus.Active,
        })}
        data-cy="FilterLinkActive"
        onClick={() => onValueChange(TodoStatus.Active)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={cn('filter__link', {
          selected: value === TodoStatus.Completed,
        })}
        data-cy="FilterLinkCompleted"
        onClick={() => onValueChange(TodoStatus.Completed)}
      >
        Completed
      </a>
    </nav>
  );
}
