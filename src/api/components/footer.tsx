type Props = {
  filter: string;
  onFilter: (f: string) => void;
  count: number;
  showCCButton: boolean;
  deleteAll: () => void;
};
export const Footer: React.FC<Props> = ({
  filter,
  count,
  onFilter,
  showCCButton,
  deleteAll,
}) => (
  <footer className="todoapp__footer" data-cy="Footer">
    <span className="todo-count" data-cy="TodosCounter">
      {`${count} items left`}
    </span>

    {/* Active filter should have a 'selected' class */}
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={filter === 'all'
          ? 'filter__link selected'
          : 'filter__link'}
        data-cy="FilterLinkAll"
        onClick={() => onFilter('all')}
      >
        All
      </a>

      <a
        href="#/active"
        className={filter === 'active'
          ? 'filter__link selected'
          : 'filter__link'}
        data-cy="FilterLinkActive"
        onClick={() => onFilter('active')}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={filter === 'completed'
          ? 'filter__link selected'
          : 'filter__link'}
        data-cy="FilterLinkCompleted"
        onClick={() => onFilter('completed')}
      >
        Completed
      </a>
    </nav>

    {/* don't show this button if there are no completed todos */}
    <button
      type="button"
      className="todoapp__clear-completed"
      data-cy="ClearCompletedButton"
      disabled={showCCButton}
      onClick={deleteAll}
    >
      Clear completed
    </button>

  </footer>
);
