import { Filter } from '../App';

export const Footer: React.FC<{
  activeCount: number;
  completedCount: number;
  filter: Filter;
  onSetFilter: (f: Filter) => void;
  onClearCompleted: () => Promise<void>;
}> = ({
  activeCount,
  completedCount,
  filter,
  onSetFilter,
  onClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeCount} item{activeCount !== 1 ? 's' : ''} left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/all"
          data-cy="FilterLinkAll"
          className={`filter__link ${filter === 'all' ? 'selected' : ''}`}
          onClick={e => {
            e.preventDefault();
            onSetFilter(Filter.All);
          }}
        >
          All
        </a>

        <a
          href="#/active"
          className={`filter__link ${filter === 'active' ? 'selected' : ''}`}
          data-cy="FilterLinkActive"
          onClick={e => {
            e.preventDefault();
            onSetFilter(Filter.Active);
          }}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={`filter__link ${filter === 'completed' ? 'selected' : ''}`}
          data-cy="FilterLinkCompleted"
          onClick={e => {
            e.preventDefault();
            onSetFilter(Filter.Completed);
          }}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedCount === 0}
        onClick={() => void onClearCompleted()}
      >
        Clear completed
      </button>
    </footer>
  );
};
