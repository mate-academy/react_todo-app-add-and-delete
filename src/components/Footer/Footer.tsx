import cn from 'classnames';

enum FilterQuery {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

type Props = {
  filteredItemsCount: number
  onFilterChange: (value: FilterQuery) => void
  filterQuery: FilterQuery
};

export const Footer:React.FC<Props> = ({
  filteredItemsCount,
  onFilterChange,
  filterQuery,
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
            { selected: filterQuery === FilterQuery.All })}
          onClick={() => {
            onFilterChange(FilterQuery.All);
          }}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={cn('filter__link',
            { selected: filterQuery === FilterQuery.Active })}
          onClick={() => {
            onFilterChange(FilterQuery.Active);
          }}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={cn('filter__link',
            { selected: filterQuery === FilterQuery.Completed })}
          onClick={() => {
            onFilterChange(FilterQuery.Completed);
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
