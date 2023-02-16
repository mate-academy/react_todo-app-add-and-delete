import cn from 'classnames';

enum FilterStatus {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

type Props = {
  filteredItemsCount: number
  changeFilterStatus: (value: FilterStatus) => void
  filterStatus: FilterStatus
};

export const Footer:React.FC<Props> = ({
  filteredItemsCount,
  changeFilterStatus,
  filterStatus,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${filteredItemsCount} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={cn('filter__link',
            { selected: filterStatus === FilterStatus.All })}
          onClick={() => {
            changeFilterStatus(FilterStatus.All);
          }}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={cn('filter__link',
            { selected: filterStatus === FilterStatus.Active })}
          onClick={() => {
            changeFilterStatus(FilterStatus.Active);
          }}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={cn('filter__link',
            { selected: filterStatus === FilterStatus.Completed })}
          onClick={() => {
            changeFilterStatus(FilterStatus.Completed);
          }}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
      >
        Clear completed
      </button>
    </footer>
  );
};
